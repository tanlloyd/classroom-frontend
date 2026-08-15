import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { Trash, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { UploadWidgetProps, UploadWidgetValue } from "@/types";

function UploadWidget({
                          value = null,
                          onChange,
                          disabled = false,
                      }: UploadWidgetProps) {

    // Store the Cloudinary upload widget
    const widgetRef = useRef<CloudinaryWidget | null>(null);

    // Store the latest onChange function
    const onChangeRef = useRef(onChange);

    // Store uploaded image preview
    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);

    // Store Cloudinary delete token
    const [deleteToken, setDeleteToken] = useState<string | null>(null);

    // Track whether image is being deleted
    const [isRemoving, setIsRemoving] = useState(false);

    // Keep the latest onChange function
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // Update preview when parent value changes
    useEffect(() => {
        setPreview(value);

        // Remove delete token if no image
        if (!value) {
            setDeleteToken(null);
        }
    }, [value]);

    // Create Cloudinary upload widget
    useEffect(() => {
        if (typeof window === "undefined") return;

        const initializeWidget = () => {

            // Only create widget once
            if (!window.cloudinary || widgetRef.current) return false;

            widgetRef.current = window.cloudinary.createUploadWidget(
                {
                    // Cloudinary settings
                    cloudName: CLOUDINARY_CLOUD_NAME,
                    uploadPreset: CLOUDINARY_UPLOAD_PRESET,

                    // Upload options
                    multiple: false,
                    folder: "uploads",
                    maxFileSize: 5_000_000,
                    clientAllowedFormats: ["png", "jpg", "jpeg"],
                },

                // Called after upload finishes
                (error, result) => {

                    if (!error && result.event === "success") {

                        // Save uploaded image info
                        const payload: UploadWidgetValue = {
                            url: result.info.secure_url,
                            publicId: result.info.public_id,
                        };

                        // Update preview
                        setPreview(payload);

                        // Save delete token
                        setDeleteToken(result.info.delete_token ?? null);

                        // Send image back to parent component
                        onChangeRef.current?.(payload);
                    }
                }
            );

            return true;
        };

        // Create widget immediately
        if (initializeWidget()) return;

        // Retry until Cloudinary script loads
        const intervalId = window.setInterval(() => {
            if (initializeWidget()) {
                window.clearInterval(intervalId);
            }
        }, 500);

        return () => window.clearInterval(intervalId);

    }, []);

    // Open upload window
    const openWidget = () => {
        if (!disabled) {
            widgetRef.current?.open();
        }
    };

    // Delete uploaded image
    const removeFromCloudinary = async () => {

        if (!preview) return;

        setIsRemoving(true);

        try {

            // Delete image from Cloudinary
            if (deleteToken) {

                const params = new URLSearchParams();
                params.append("token", deleteToken);

                await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
                    {
                        method: "POST",
                        body: params,
                    }
                );
            }

        } catch (error) {

            console.error("Failed to remove image", error);

        } finally {

            // Clear preview
            setPreview(null);

            // Remove delete token
            setDeleteToken(null);

            // Notify parent component
            onChangeRef.current?.(null);

            setIsRemoving(false);
        }
    };

    return (

        // Show upload UI
        <div className="space-y-2">

            {/* If image exists, show preview */}
            {preview ? (

                <div className="upload-preview">

                    {/* Uploaded image */}
                    <img src={preview.url} alt="Uploaded file" />

                    {/* Delete button */}
                    <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={removeFromCloudinary}
                        disabled={isRemoving || disabled}
                    >
                        <Trash className="size-4" />
                    </Button>

                </div>

            ) : (

                // Otherwise show upload area
                <div
                    className="upload-dropzone"
                    role="button"
                    tabIndex={0}
                    onClick={openWidget}
                    onKeyDown={(event) => {

                        // Press Enter or Space to upload
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openWidget();
                        }
                    }}
                >

                    <div className="upload-prompt">

                        {/* Upload icon */}
                        <UploadCloud className="icon" />

                        {/* Upload instructions */}
                        <div>
                            <p>Click to upload photo</p>
                            <p>PNG, JPG up to 5MB</p>
                        </div>

                    </div>

                </div>

            )}
        </div>
    );
}

export default UploadWidget;
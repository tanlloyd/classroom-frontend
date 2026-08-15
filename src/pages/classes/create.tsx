import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";

import { Textarea } from "@/components/ui/textarea";
import { useBack, useList } from "@refinedev/core";
import { Loader2 } from "lucide-react";
import { classSchema } from "@/lib/schema";
import UploadWidget from "@/components/upload-widget";
import { Subject, User } from "@/types";
import z from "zod";

// Create the "Create Class" page
const ClassesCreate = () => {

    // Go back to previous page
    const back = useBack();

    // Create and configure the form
    const form = useForm({

        // Validate the form using Zod
        resolver: zodResolver(classSchema),

        // Connect this form to the "classes" backend API
        refineCoreProps: {
            resource: "classes",
            action: "create",
        },

        // Default form values
        defaultValues: {
            status: "active",
        },
    });

    // Get useful functions from the form
    const {
        refineCore: { onFinish },   // Submit data to backend
        handleSubmit,               // Handle form submission
        formState: { isSubmitting, errors }, // Form loading & errors
        control,                    // Connect inputs to the form
    } = form;

    // Watch uploaded banner image
    const bannerPublicId = form.watch("bannerCldPubId");


    // Submit form to backend
    const onSubmit = async (values) => {
        try {

            // Send form data to backend
            await onFinish(values);

        } catch (error) {

            // Print error if submission fails
            console.error(error);

        }
    };


    // Get all subjects from backend
    // Used for Subject dropdown
    const { query: subjectsQuery } = useList({
        resource: "subjects",
        pagination: {
            pageSize: 100,
        },
    });


    // Get all teachers from backend
    // Used for Teacher dropdown
    const { query: teachersQuery } = useList({
        resource: "users",

        // Only fetch teachers
        filters: [
            {
                field: "role",
                operator: "eq",
                value: "teacher",
            },
        ],

        pagination: {
            pageSize: 100,
        },
    });

    // Store fetched teachers and subjects
    const teachers = teachersQuery.data?.data || [];
    const subjects = subjectsQuery.data?.data || [];

    return (


        // Create Class Page UI
        <CreateView>

            {/* Page breadcrumb */}
            <Breadcrumb />

            {/* Page title */}
            <h1>Create a Class</h1>

            {/* Go Back button */}
            <Button>Go Back</Button>

            {/* Create Class Form*/}

            <Form>

                {/* Upload banner image */}
                <FormField name="bannerUrl" />

                {/* Enter class name */}
                <FormField name="name" />

                {/* Select subject */}
                <FormField name="subjectId" />

                {/* Select teacher */}
                <FormField name="teacherId" />

                {/* Enter class capacity */}
                <FormField name="capacity" />

                {/* Select Active / Inactive */}
                <FormField name="status" />

                {/* Enter description */}
                <FormField name="description" />

                {/* Submit form */}
                <Button type="submit">
                    Create Class
                </Button>

            </Form>

        </CreateView>
    );
};

export default ClassesCreate;
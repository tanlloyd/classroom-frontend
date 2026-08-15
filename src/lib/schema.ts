import * as z from "zod";

// validate faculty form
export const facultySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),  // Faculty name
    email: z.string().email("Invalid email address"),   // Must be a valid email
    role: z.enum(["admin", "teacher", "student"], {
        required_error: "Please select a role",
    }), // Only these 3 roles are allowed
    department: z.string(), // Department name
    image: z.string().optional(),   // Profile image (optional)
    imageCldPubId: z.string().optional(),   // Cloudinary image ID (optional)
});

// Validate Subject Form
export const subjectSchema = z.object({
    name: z.string().min(3, "Subject name must be at least 3 characters"),  // Subject name
    code: z.string().min(5, "Subject code must be at least 5 characters"),  // Subject code
    description: z
        .string()
        .min(5, "Subject description must be at least 5 characters"),   // Description
    department: z
        .string()
        .min(2, "Subject department must be at least 2 characters"),    // Department
});


// Validate Class Schedule
const scheduleSchema = z.object({
    day: z.string().min(1, "Day is required"), // Day of class
    startTime: z.string().min(1, "Start time is required"), // Start time
    endTime: z.string().min(1, "End time is required"), // End time
});

// Validate Class Form
export const classSchema = z.object({
    name: z
        .string()
        .min(2, "Class name must be at least 2 characters")
        .max(50, "Class name must be at most 50 characters"),   // Class name
    description: z
        .string({ required_error: "Description is required" })
        .min(5, "Description must be at least 5 characters"),   // Description
    subjectId: z.coerce
        .number({
            required_error: "Subject is required",
            invalid_type_error: "Subject is required",
        })
        .min(1, "Subject is required"),
    teacherId: z.string().min(1, "Teacher is required"),    // Teacher ID
    capacity: z.coerce
        .number({
            required_error: "Capacity is required",
            invalid_type_error: "Capacity is required",
        })
        .min(1, "Capacity must be at least 1"),     // Maximum students
    status: z.enum(["active", "inactive"]),    // Class status
    bannerUrl: z
        .string({ required_error: "Class banner is required" })
        .min(1, "Class banner is required"),        // Banner image URL
    bannerCldPubId: z
        .string({ required_error: "Banner reference is required" })
        .min(1, "Banner reference is required"),        // Cloudinary banner ID
    inviteCode: z.string().optional(),          // Invite code (optional)
    schedules: z.array(scheduleSchema).optional(),      // List of class schedules
});

// Validate Enrollment Form
export const enrollmentSchema = z.object({
    classId: z.coerce
        .number({
            required_error: "Class ID is required",
            invalid_type_error: "Class ID is required",
        })
        .min(1, "Class ID is required"),        // Class to join
    studentId: z.string().min(1, "Student ID is required"),     // Student ID
});

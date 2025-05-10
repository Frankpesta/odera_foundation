// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
	// Existing endpoint
	imageUploader: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			const user = await auth(req);
			if (!user) throw new Error("Unauthorized");
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId);
			console.log("file url", file.url);
		}),

	// New endpoint for eventImage
	eventImage: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			const user = await auth(req);
			if (!user) throw new Error("Unauthorized");
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId);
			console.log("file url", file.url);
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

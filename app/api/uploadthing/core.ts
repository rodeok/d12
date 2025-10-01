import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({ pdf: { maxFileSize: "16MB", maxFileCount: 5 } })
    .middleware(async ({ req }) => {
      // Optional: Add authentication check
      // const session = await getServerSession();
      // if (!session) throw new Error("Unauthorized");
      
      return { userId: "user" }; // Return any metadata you want
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document upload complete:", file.url);
      console.log("Metadata:", metadata);
      
      return { success: true, url: file.url };
    }),
    
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      // Optional: Add authentication check
      // const session = await getServerSession();
      // if (!session) throw new Error("Unauthorized");
      
      return { userId: "user" }; // Return any metadata you want
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image upload complete:", file.url);
      console.log("Metadata:", metadata);
      
      return { success: true, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
import { SetMetadata } from "@nestjs/common";

// Insert permission identification into the metadata
export function AuthTags(...auths: string[]) {
    return SetMetadata("authTags", auths);
};
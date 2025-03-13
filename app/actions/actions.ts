'use server';

import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { User, userSchema } from './schemas';

const prisma = new PrismaClient();

/**
 * Maps a Prisma User object to a Zod User object.
 */
const mapPrismaUserToZodUser = (prismaUser: PrismaUser): User => {
    return userSchema.parse({
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        phoneNumber: prismaUser.phoneNumber,
    });
};

/**
 * Search users by name prefix.
 */
export async function searchUsers(query: string): Promise<User[]> {
    console.log('Searching users with query:', query);
    const prismaUsers = await prisma.user.findMany({
        where: {
            name: {
                startsWith: query,
                mode: 'insensitive', // Case-insensitive search
            },
        },
    });

    return prismaUsers.map(mapPrismaUserToZodUser);
}

/**
 * Add a new user.
 */
export async function addUser(data: Omit<User, 'id'>): Promise<User> {
    // Validate input data
    const validatedData = userSchema.omit({ id: true }).parse(data);

    const prismaUser = await prisma.user.create({
        data: validatedData,
    });

    return mapPrismaUserToZodUser(prismaUser);
}

/**
 * Delete a user by ID.
 */
export async function deleteUser(id: string): Promise<void> {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
        throw new Error(`User with id ${id} not found`);
    }

    await prisma.user.delete({ where: { id } });
    console.log(`User with id ${id} has been deleted.`);
    revalidatePath('/');
}

/**
 * Update an existing user.
 */
export async function updateUser(
    id: string,
    data: Partial<Omit<User, 'id'>>
): Promise<User> {
    // Validate partial input data
    const validatedData = userSchema
        .omit({ id: true })
        .partial()
        .parse(data);

    const prismaUser = await prisma.user.update({
        where: { id },
        data: validatedData,
    });

    console.log(`User with id ${id} has been updated.`);
    revalidatePath('/');

    return mapPrismaUserToZodUser(prismaUser);
}

/**
 * Get a user by ID.
 */
export async function getUserById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({ where: { id } });

    return prismaUser ? mapPrismaUserToZodUser(prismaUser) : null;
}
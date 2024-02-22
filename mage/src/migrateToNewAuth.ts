import { PrismaClient } from "@prisma/client";

export async function migrateGoogleAuth(prismaClient: PrismaClient) {
  return createSocialLoginMigration(prismaClient, "google");
}

export async function migrateGitHubAuth(prismaClient: PrismaClient) {
  return createSocialLoginMigration(prismaClient, "github");
}

async function createSocialLoginMigration(
  prismaClient: PrismaClient,
  providerName: "google" | "github"
) {
  const users = await prismaClient.user.findMany({
    include: {
      auth: true,
      externalAuthAssociations: true,
    },
  });

  let numAlreadyMigratedUsers = 0;
  let numUsersMissingProvider = 0;
  let numMigratedUsers = 0;
  for (const user of users) {
    if (user.auth) {
      console.log("User was already migrated, skipping", user.id);
      numAlreadyMigratedUsers++;
      continue;
    }

    const provider = user.externalAuthAssociations.find(
      (provider) => provider.provider === providerName
    );

    if (!provider) {
      console.log(`Missing ${providerName} provider, skipping user`, user.id);
      numUsersMissingProvider++;
      continue;
    }

    await prismaClient.auth.create({
      data: {
        identities: {
          create: {
            providerName,
            providerUserId: provider.providerId,
            providerData: JSON.stringify({}),
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    console.log(`Migrated user`, user.id);
    numMigratedUsers++;
  }

  console.log('=============================');
  console.log('Num already migrated users: ', numAlreadyMigratedUsers);
  console.log('Num users missing provider: ', numUsersMissingProvider);
  console.log('Num migrated users: ', numMigratedUsers);
}

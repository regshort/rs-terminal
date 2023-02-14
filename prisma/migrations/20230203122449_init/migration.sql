-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "canAccess" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isModerator" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "securities" (
    "ticker" TEXT NOT NULL DEFAULT 'N/A',
    "name" TEXT NOT NULL DEFAULT 'N/A',
    "desc" TEXT NOT NULL DEFAULT 'N/A',
    "isShare" BOOLEAN NOT NULL DEFAULT false,
    "hasFloat" BOOLEAN NOT NULL DEFAULT false,
    "hasMarketCap" BOOLEAN NOT NULL DEFAULT false,
    "hasYf" BOOLEAN NOT NULL DEFAULT false,
    "hasImg" BOOLEAN NOT NULL DEFAULT false,
    "lastImgCheck" TIMESTAMP(3),

    CONSTRAINT "securities_pkey" PRIMARY KEY ("ticker")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "workspace" JSONB NOT NULL,
    "watchlist" BOOLEAN NOT NULL DEFAULT false,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "globalDefault" BOOLEAN NOT NULL DEFAULT false,
    "relativeDate" TEXT,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "creator" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watchlists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "globalDefault" BOOLEAN NOT NULL DEFAULT false,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "creator" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "watchlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "key" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT NOT NULL DEFAULT 'invite',
    "uses" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "creator" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Recentfilter" (
    "id" TEXT NOT NULL,
    "creator" TEXT NOT NULL,

    CONSTRAINT "Recentfilter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "_workspaceDefaultedby" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_workspaceLikedby" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_watchlistLikedby" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SecurityToWatchlist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LinkToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RecentfilterToSecurity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "securities_ticker_key" ON "securities"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_name_creator_key" ON "workspaces"("name", "creator");

-- CreateIndex
CREATE UNIQUE INDEX "watchlists_name_creator_key" ON "watchlists"("name", "creator");

-- CreateIndex
CREATE UNIQUE INDEX "Link_name_creator_key" ON "Link"("name", "creator");

-- CreateIndex
CREATE UNIQUE INDEX "Recentfilter_creator_key" ON "Recentfilter"("creator");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "_workspaceDefaultedby_AB_unique" ON "_workspaceDefaultedby"("A", "B");

-- CreateIndex
CREATE INDEX "_workspaceDefaultedby_B_index" ON "_workspaceDefaultedby"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_workspaceLikedby_AB_unique" ON "_workspaceLikedby"("A", "B");

-- CreateIndex
CREATE INDEX "_workspaceLikedby_B_index" ON "_workspaceLikedby"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_watchlistLikedby_AB_unique" ON "_watchlistLikedby"("A", "B");

-- CreateIndex
CREATE INDEX "_watchlistLikedby_B_index" ON "_watchlistLikedby"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SecurityToWatchlist_AB_unique" ON "_SecurityToWatchlist"("A", "B");

-- CreateIndex
CREATE INDEX "_SecurityToWatchlist_B_index" ON "_SecurityToWatchlist"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LinkToUser_AB_unique" ON "_LinkToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LinkToUser_B_index" ON "_LinkToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RecentfilterToSecurity_AB_unique" ON "_RecentfilterToSecurity"("A", "B");

-- CreateIndex
CREATE INDEX "_RecentfilterToSecurity_B_index" ON "_RecentfilterToSecurity"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlists" ADD CONSTRAINT "watchlists_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recentfilter" ADD CONSTRAINT "Recentfilter_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_workspaceDefaultedby" ADD CONSTRAINT "_workspaceDefaultedby_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_workspaceDefaultedby" ADD CONSTRAINT "_workspaceDefaultedby_B_fkey" FOREIGN KEY ("B") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_workspaceLikedby" ADD CONSTRAINT "_workspaceLikedby_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_workspaceLikedby" ADD CONSTRAINT "_workspaceLikedby_B_fkey" FOREIGN KEY ("B") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_watchlistLikedby" ADD CONSTRAINT "_watchlistLikedby_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_watchlistLikedby" ADD CONSTRAINT "_watchlistLikedby_B_fkey" FOREIGN KEY ("B") REFERENCES "watchlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SecurityToWatchlist" ADD CONSTRAINT "_SecurityToWatchlist_A_fkey" FOREIGN KEY ("A") REFERENCES "securities"("ticker") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SecurityToWatchlist" ADD CONSTRAINT "_SecurityToWatchlist_B_fkey" FOREIGN KEY ("B") REFERENCES "watchlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkToUser" ADD CONSTRAINT "_LinkToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Link"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkToUser" ADD CONSTRAINT "_LinkToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecentfilterToSecurity" ADD CONSTRAINT "_RecentfilterToSecurity_A_fkey" FOREIGN KEY ("A") REFERENCES "Recentfilter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecentfilterToSecurity" ADD CONSTRAINT "_RecentfilterToSecurity_B_fkey" FOREIGN KEY ("B") REFERENCES "securities"("ticker") ON DELETE CASCADE ON UPDATE CASCADE;

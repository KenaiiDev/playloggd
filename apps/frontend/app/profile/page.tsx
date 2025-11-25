"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useGameCollectionStore } from "@/stores/game-collection-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  Badge,
  Button,
} from "@/components/ui";
import { User, Mail, Calendar, Gamepad2, Edit, KeyRound } from "lucide-react";
import { GameStatusEnum } from "@playloggd/domain";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const entries = useGameCollectionStore((state) => state.entries);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);

  const stats = useMemo(() => {
    const entriesArray = Array.from(entries.values());

    return {
      total: entriesArray.length,
      playing: entriesArray.filter((e) => e.status === GameStatusEnum.PLAYING)
        .length,
      completed: entriesArray.filter(
        (e) =>
          e.status === GameStatusEnum.COMPLETED ||
          e.status === GameStatusEnum.FULLY_COMPLETED
      ).length,
      backlog: entriesArray.filter(
        (e) =>
          e.status === GameStatusEnum.BACKLOG ||
          e.status === GameStatusEnum.WISHLIST
      ).length,
      dropped: entriesArray.filter(
        (e) =>
          e.status === GameStatusEnum.DROPPED ||
          e.status === GameStatusEnum.NOT_FOR_ME
      ).length,
    };
  }, [entries]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const createdAt = user.createdAt ? new Date(user.createdAt) : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-32 w-32">
                  <div className="flex items-center justify-center h-full w-full bg-primary/10">
                    <User className="h-16 w-16 text-primary" />
                  </div>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-2">
                <Mail className="h-3 w-3" />
                {user.email}
              </p>
              {createdAt && (
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-2">
                  <Calendar className="h-3 w-3" />
                  Joined{" "}
                  {createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {user.bio && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Bio</h3>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>
              )}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setIsChangePasswordDialogOpen(true)}
                >
                  <KeyRound className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Collection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Gamepad2 className="h-6 w-6" />
              Game Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stats.total}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Games</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-1">
                    {stats.playing}
                  </div>
                  <p className="text-sm text-muted-foreground">Playing</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-500 mb-1">
                    {stats.completed}
                  </div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-500 mb-1">
                    {stats.backlog}
                  </div>
                  <p className="text-sm text-muted-foreground">Backlog</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-500 mb-1">
                    {stats.dropped}
                  </div>
                  <p className="text-sm text-muted-foreground">Dropped</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-1">
                    {stats.completed > 0
                      ? Math.round((stats.completed / stats.total) * 100)
                      : 0}
                    %
                  </div>
                  <p className="text-sm text-muted-foreground">Completion</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.total === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Gamepad2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-2">No games yet</p>
                  <p className="text-sm">
                    Start adding games to your collection to track your
                    progress!
                  </p>
                  <Button className="mt-4" onClick={() => router.push("/")}>
                    Browse Games
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You have{" "}
                    <span className="font-semibold text-foreground">
                      {stats.total}
                    </span>{" "}
                    games in your collection. Keep tracking your gaming journey!
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{stats.playing} Playing</Badge>
                    <Badge variant="secondary">
                      {stats.completed} Completed
                    </Badge>
                    <Badge variant="secondary">{stats.backlog} Backlog</Badge>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => router.push("/collection")}
                  >
                    View Full Collection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <ChangePasswordDialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      />
    </div>
  );
}

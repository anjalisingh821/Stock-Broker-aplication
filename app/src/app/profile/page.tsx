import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Wallet } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your account information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Personal Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="text-lg font-semibold">
                {session.user?.name || "Not set"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-lg font-semibold">{session.user?.email}</div>
            </div>
            <Link href="/settings">
              <button className="text-sm text-blue-600 hover:underline">
                Edit Profile →
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>KYC Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge
                variant={
                  profile?.kycStatus === "VERIFIED"
                    ? "success"
                    : profile?.kycStatus === "REJECTED"
                    ? "destructive"
                    : "warning"
                }
              >
                {profile?.kycStatus || "PENDING"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              This is a demo application. KYC verification is simulated.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <CardTitle>Account Balance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(profile?.cashBalance || 0)}
            </div>
            <Link href="/funds">
              <button className="text-sm text-blue-600 hover:underline mt-2">
                Manage Funds →
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


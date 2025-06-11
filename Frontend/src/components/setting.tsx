import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShowName } from "@/Context/ShowName";
import { Logout } from "./Logout";
import {
  UserIcon,
  ArrowRightStartOnRectangleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

import { SendOtpToEmail } from "@/Context/SendOtpToEmail";
import { checkAuthentication } from "@/Context/isEmailAuthenticated";
import { useEffect, useState } from "react";

interface userData {
  id: string;
  email: string;
  isAccountVerified: boolean;
  username: string;
}

interface userDataMessage {
  success: boolean;
  message?: string;
  user?: userData; // Optional in case of failed authentication
}

export function Setting() {
  const [authData, setAuthData] = useState<userDataMessage | null>(null);
  //console.log("ajhsgdyusdgfyusdgfus", authData?.user);

  useEffect(() => {
    const fetchAuthData = async () => {
      const data = await checkAuthentication();
      setAuthData(data);
    };

    fetchAuthData();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full bg-white text-blue-700 w-10 h-10 flex cursor-pointer items-center justify-center shadow-md border border-gray-300">
          <ShowName />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 font-bold  bg-gray-400">
        <DropdownMenuLabel className="text-lg">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>
              <UserIcon fill="black" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          {!authData?.user?.isAccountVerified && (
            <DropdownMenuItem className="cursor-pointer">
              <SendOtpToEmail />
              <DropdownMenuShortcut>
                <EnvelopeIcon fill="black" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="cursor-pointer hover:bg-gray-800">
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Logout />
          <DropdownMenuShortcut>
            <ArrowRightStartOnRectangleIcon fill="black" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

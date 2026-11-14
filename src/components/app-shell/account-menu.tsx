import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrefs } from "@/i18n/preferences";
import type { Lang, Theme } from "@/lib/app-store";
import { useAccountSession } from "@/lib/account-session";
import { useSignOutFlow } from "@/components/sign-out-control";
import { StatusDetailsDialog, type ShellStatus } from "./shell-status";

/** The account menu shared by the desktop rail and the mobile top bar. */
export function AccountMenu({
  status,
  trigger,
  onOpenLogin,
  onOpenSearch,
}: {
  status: ShellStatus;
  trigger: ReactNode;
  /** Shows a Community Login entry when signed out. */
  onOpenLogin?: () => void;
  /** Keeps the page palette (jump to any screen) reachable from the menu. */
  onOpenSearch?: () => void;
}) {
  const { t, theme, setTheme, lang, setLang } = usePrefs();
  const session = useAccountSession();
  const { start: startSignOut, dialog: signOutDialog } = useSignOutFlow();
  const [statusOpen, setStatusOpen] = useState(false);
  const signedIn = session.status === "authenticated";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rp-shell w-60 border-shell-divider bg-shell-surface text-shell-text"
        >
          {!signedIn && onOpenLogin ? (
            <DropdownMenuItem onSelect={() => onOpenLogin()}>
              {t("nav.login")}
            </DropdownMenuItem>
          ) : null}
          {signedIn ? (
            <DropdownMenuItem asChild>
              <Link to="/profile">{t("shell.settings")}</Link>
            </DropdownMenuItem>
          ) : null}
          {onOpenSearch ? (
            <DropdownMenuItem onSelect={() => onOpenSearch()}>
              {t("palette.open")}
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t("shell.theme")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as Theme)}
          >
            <DropdownMenuRadioItem value="light">
              {t("shell.themeLight")}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              {t("shell.themeDark")}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              {t("shell.themeSystem")}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t("shell.language")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={lang}
            onValueChange={(value) => setLang(value as Lang)}
          >
            <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="hi" lang="hi">
              हिन्दी
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setStatusOpen(true)}>
            {t("shell.statusDetails")}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/about">{t("shell.about")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/contact">{t("shell.contact")}</Link>
          </DropdownMenuItem>

          {signedIn ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                // The menu closes; the unsynced-drafts check and its dialog
                // live outside it, so they stay mounted.
                onSelect={() => void startSignOut()}
              >
                {t("shell.logout")}
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <StatusDetailsDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        status={status}
      />
      {signOutDialog}
    </>
  );
}

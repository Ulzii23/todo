"use client";
import { useUser } from '@/lib/context/user-provider';
import { LogOutIcon } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeSwitcher } from './ThemeSwitcher';

const Header = () => {
    const { user, loading, logout } = useUser();
    if (!user || loading) {
        return null;
    }
    return (
        <div className='shadow-sm text-card-foreground border-b' style={{ backgroundColor: 'var(--header-bg)' }}>
            <div className="container mx-auto p-2 flex gap-2 items-center justify-between">
                <h5 className="text-lg font-bold">Welcome, {user.username}!</h5>
                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <Button
                        onClick={logout}
                        variant="destructive"
                        size="icon-sm"
                        className="h-9 w-9"
                    >
                        <LogOutIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Header;
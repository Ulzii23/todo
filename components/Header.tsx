"use client";
import { useUser } from '@/lib/context/user-provider';
import { LogOutIcon } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
     const { user, loading, logout } = useUser();
     if(!user || loading) {
         return null;
     }
    return (
        <div className='flex gap-2 items-center  shadow-sm justify-between p-2 bg-slate-700 text-slate-50'>
            <h5 className="text-lg font-bold">Welcome, {user.username}!</h5>   
            <Button
                onClick={logout}
                variant="destructive"
                size="icon-sm"
            >
                <LogOutIcon/>
            </Button>
        </div>
    );
}

export default Header;
"use client"
import { AsyncSelect } from "@/components/responsive-select";
import { Contact } from "@/types/contacts";
import { useState } from "react";

export default function AsyncSelectExample({ contacts, onValueChange }: { contacts: Contact[], onValueChange?: (value: string) => void }) {
    const [selectedUser, setSelectedUser] = useState<string>("");

    async function searchContacts() {
        return contacts
    }

    function handleChange(value: string) {
        setSelectedUser(value)
        if (onValueChange) {
            onValueChange(value) // 🔥 avisamos al padre
        }
    }

    return (
        <AsyncSelect<Contact>
            fetcher={searchContacts}
            preload
            filterFn={(user, query) => user.name.toLowerCase().includes(query.toLowerCase())}
            renderOption={(user) => (
                <div className="flex items-center gap-2">
                    {/* <Image
                                src={user.avatar}
                                alt={user.name}
                                width={24}
                                height={24}
                                className="rounded-full"
                            />
                    <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {user.name.charAt(0)}
                    </div> */}
                    <div className="flex flex-col">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.balance}</div>
                    </div>
                </div>
            )}
            getOptionValue={(user) => user.id.toString()}
            getDisplayValue={(user) => (
                <div className="flex items-center gap-2 text-left">
                    {/* <Image
                                src={user.avatar}
                                alt={user.name}
                                width={24}
                                height={24}
                                className="rounded-full"
                            /> 
                    <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {user.name.charAt(0)}
                    </div>*/}
                    <div className="flex flex-col leading-tight">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.balance}</div>
                    </div>
                </div>
            )}
            notFound={<div className="py-6 text-center text-sm">No users found</div>}
            label="Clientes"
            placeholder="Buscar Clientes..."
            value={selectedUser}
            onChange={handleChange}
            width="250px"
        />
    )
}
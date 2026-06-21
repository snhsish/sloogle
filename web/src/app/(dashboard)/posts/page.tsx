import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import ApiKeysTable from "@/components/api-keys-table"
import Configuration from "@/components/configuration"
import PostsTable from "./posts"

export default function PostsPage() {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                            />
                            <h1>Posts</h1>
                        </div>
                    </header>
                    <div className="flex flex-col gap-16 p-4 md:p-8">
                        <PostsTable/>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}

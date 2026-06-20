import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { CheckCircle, PackageIcon, PlusCircle, SlashIcon } from "lucide-react"
import { Button } from "./ui/button"

export default function Configuration() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">How to configure the Slack bot</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your API keys for programmatic access.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Item variant="outline">
                    <ItemMedia variant="icon">
                        <PlusCircle />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>
                            Create a new API Key
                        </ItemTitle>
                        <ItemDescription className="line-clamp-3">
                            Generate a new API key from the above section (visible only once) and copy it. API keys are stored after encryption, so you won&apos;t be able to copy them later.
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="outline">
                    <ItemMedia variant="icon">
                        <SlashIcon />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>
                            Run the <code className="bg-secondary text-secondary-foreground">/set-token [token]</code> command
                        </ItemTitle>
                        <ItemDescription className="line-clamp-3">
                            Go to a channel which Sloogle bot has access to and run the above command with token passed in the first argument. On success, you&apos;re ready to create a post.
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="outline">
                    <ItemMedia variant="icon">
                        <PackageIcon />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>
                            Create your first post
                        </ItemTitle>
                        <ItemDescription className="line-clamp-3">
                            Publish any message publicly within the community (Sloogle must have channel access) using the <code className="bg-secondary text-secondary-foreground">/publish [message-id/message-link]</code> command.
                        </ItemDescription>
                    </ItemContent>
                </Item>
            </div>
        </div>
    )
}

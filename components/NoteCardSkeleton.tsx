import { Skeleton } from "./ui/skeleton"
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"

export default function NoteCardSkeleton() {
    return (
        <Card className="mb-3">
            <CardHeader className="p-4 pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
            </CardFooter>
        </Card>
    )
}

import Link from "next/link"
import { Translation } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { TranslationOperations } from "@/components/translation-operations"

interface TranslationItemProps {
  translation: Pick<Translation, "id" | "title" | "published" | "createdAt">
}

export function TranslationItem({ translation }: TranslationItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${translation.id}`}
          className="font-semibold hover:underline"
        >
          {translation.title}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(translation.createdAt?.toDateString())}
          </p>
        </div>
      </div>
      <TranslationOperations
        translation={{ id: translation.id, title: translation.title }}
      />
    </div>
  )
}

TranslationItem.Skeleton = function TranslationItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}

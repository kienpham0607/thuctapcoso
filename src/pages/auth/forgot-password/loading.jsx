import { Skeleton } from "../../../components/ui/skeleton"

export default function ForgotPasswordLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col items-center">
          <Skeleton className="h-10 w-[150px] mb-6" />
          <Skeleton className="h-7 w-[200px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <Skeleton className="h-5 w-[100px] mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>

          <Skeleton className="h-10 w-full" />
        </div>

        <div className="mt-4 flex justify-center">
          <Skeleton className="h-5 w-[150px]" />
        </div>
      </div>
    </div>
  )
}
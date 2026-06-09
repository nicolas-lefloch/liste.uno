import { redirect, useParams, type ClientLoaderFunctionArgs } from "react-router"
import LocalStorageInterface from "~/services/LocalStorageInterface"

export const clientLoader = ({ params }: { params: { listID: string } }) => {
    const { listID } = params
    return redirect(`/${listID}/build-list`)
} 

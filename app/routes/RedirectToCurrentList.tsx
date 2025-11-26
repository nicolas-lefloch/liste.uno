import { redirect } from "react-router"
import LocalStorageInterface from "~/services/LocalStorageInterface"

export const clientLoader = () => redirect(`/${LocalStorageInterface.getCurrentListId()}/build-list`)

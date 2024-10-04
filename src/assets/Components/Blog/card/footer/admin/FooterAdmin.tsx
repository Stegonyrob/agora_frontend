import { useState } from "react";
import { IPost } from "../../../../../../core/posts/IPost";
import { InteractionAdmin, InteractionAdminCount } from "./InteractionAdmin";
import LayoutFooter from "./LayoutFooter";
const loveIconFilled = import.meta.env.VITE_LOVE_ICON_FILLED;
const initialLoveIcon: string | undefined = import.meta.env.VITE_LOVE_ICON;
const archiveIcon = import.meta.env.VITE_ARCHIVE_ICON;
const desArchiveIcon = import.meta.env.VITE_UNARCHIVE_ICON;
const editIcon = import.meta.env.VITE_EDIT_ICON;
const replyIcon = import.meta.env.VITE_REPLY_ICON;
interface FooterAdminProps {
    loveIcon: string
    loveCount: number
    isLoved: boolean
    color: string
    love: () => void
    archive: () => void
    edit: () => void
    reply: () => void
    unArchive: () => void
    setLoveIcon: (value: string) => void
    setLoveCount: (value: number) => void
    setColor: (value: string) => void
    setLoved: (value: boolean) => void
    setArchive: (value: boolean) => void
    setEdit: (value: boolean) => void
    setReply: (value: boolean) => void
    setUnArchive: (value: boolean) => void
    post: IPost;

    commentCounter: (value: number) => void
    loveCounter: number;
    onComment: (postId: number) => void;
    onLove: (value: number) => void;
}
const FooterAdmin: React.FC<FooterAdminProps> = ({
    post,
    archive,
    unArchive,
    commentCounter,
    loveCounter,
    onComment,
    onLove,
}) => {
    const [loveIcon, setLoveIcon] = useState<string | undefined>(initialLoveIcon ?? "");
    const [isLoved, setLoved] = useState(false)
    const [loveCount, setLoveCount] = useState(0)
    const [color, setColor] = useState("#000")
    const [isArchive, setArchive] = useState(false)
    const [isEdit, setEdit] = useState(false)
    const [isReply, setReply] = useState(false)
    const [isUnArchive, setUnArchive] = useState(false)





    const love = () => {
        if (loveIcon === null || loveIcon === undefined) {
            return
        }
        if (!isLoved) {
            setLoveIcon(loveIconFilled ?? "")
            setLoveCount(loveCount => loveCount + 1)
            setColor("#EF0D6C")
            setLoved(true)
            return
        }
        setLoveIcon(loveIcon ?? "")
        setLoveCount(loveCount => loveCount - 1)
        setColor("#000")
        setLoved(false)
    }

    return <LayoutFooter>
        <InteractionAdminCount
            icon={loveIcon ?? ""}
            count={loveCount}
            interact={love}
            color={color} />
        <InteractionAdmin icon={archiveIcon ?? ""} />
        <InteractionAdmin icon={desArchiveIcon ?? ""} />
        <InteractionAdmin icon={editIcon ?? ""} />
        <InteractionAdmin icon={replyIcon ?? ""} />
    </LayoutFooter>

}

export default FooterAdmin
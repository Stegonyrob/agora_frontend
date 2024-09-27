import { useState } from "react";
import InteractionAdmin from "./InteractionAdmin";
import LayoutFooter from "./LayoutFooter";
const loveIconFilled = import.meta.env.VITE_LOVE_ICON_FILLED;
const initialLoveIcon: string | undefined = import.meta.env.VITE_LOVE_ICON;
const archiveIcon = import.meta.env.VITE_ARCHIVE_ICON;
const desArchiveIcon = import.meta.env.VITE_DESARCHIVE_ICON
const editIcon = import.meta.env.VITE_EDIT_ICON
const replyIcon = import.meta.env.VITE_REPLY_ICON

const FooterAdmin = () => {
    const [loveIcon, setLoveIcon] = useState<string | undefined>(initialLoveIcon ?? "");
    const [isLoved, setLoved] = useState(false)
    const [loveCount, setLoveCount] = useState(50)
    const [color, setColor] = useState("#000")



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
        <InteractionAdmin
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
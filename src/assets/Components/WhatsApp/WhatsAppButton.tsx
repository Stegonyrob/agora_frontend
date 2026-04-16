import { FloatingWhatsApp } from "./FloatingWhatsApp";


interface WhatsAppButtonProps {
    phoneNumber: string;
    welcomeMessage: string;
    initialMessage: string;
    delay: number;
}

export default function WhatsAppButton(props: WhatsAppButtonProps) {
    const { phoneNumber, welcomeMessage, initialMessage, delay } = props;
    const handleClick = () => {
        const message = `${welcomeMessage} ${initialMessage}`;
        const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };
    return (
        <div className="App">
            <FloatingWhatsApp
                phoneNumber="34693545993"
                accountName="Centro Educativo Ágora"
                allowEsc
                allowClickAway
                notification
                notificationSound
            />
        </div>
    );
}

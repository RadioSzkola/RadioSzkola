import { createPortal } from "react-dom";

import styles from "../styles/modal.module.css";

type ModalProps = {
    children: React.ReactElement;
    overlayClass?: string;
    overlayClassOpen?: string;
    wrapperClass?: string;
    wrapperClassOpen?: string;
    open: boolean;
};

export default function Modal({
    children,
    open,
    overlayClass,
    overlayClassOpen,
    wrapperClass,
    wrapperClassOpen,
}: ModalProps) {
    return createPortal(
        <>
            <div
                className={`
                    ${styles.overlay}
                    ${open ? styles.overlay__open : ""}
                    ${overlayClass ? overlayClass : ""}
                    ${open && overlayClassOpen ? overlayClassOpen : ""}
                `}
            />
            <div
                className={`
                    ${styles.wrapper}
                    ${open ? styles.wrapper__open : ""}
                    ${wrapperClass ? wrapperClass : ""}
                    ${open && wrapperClassOpen ? wrapperClassOpen : ""}
                `}
            >
                {children}
            </div>
        </>,
        document.body,
    );
}

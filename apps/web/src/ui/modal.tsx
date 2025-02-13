import { createPortal } from "react-dom";

import styles from "../styles/modal.module.css";
import { useEffect, useRef } from "react";

type ModalProps = {
    children: React.ReactElement;
    overlayClass?: string;
    overlayClassOpen?: string;
    wrapperClass?: string;
    wrapperClassOpen?: string;
    open: boolean;
    onOverlayClick?: () => void;
};

export default function Modal({
    children,
    open,
    overlayClass,
    overlayClassOpen,
    wrapperClass,
    wrapperClassOpen,
    onOverlayClick,
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
                onClick={onOverlayClick}
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

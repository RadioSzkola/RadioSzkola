import { createPortal } from "react-dom";

import styles from "../styles/modal.module.css";
import { useRef } from "react";

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
    const wraperRef = useRef<HTMLDivElement>(null);

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
                ref={wraperRef}
            >
                {children}
            </div>
        </>,
        document.body,
    );
}

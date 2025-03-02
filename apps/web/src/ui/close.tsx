import { Icon } from "@iconify/react";
import styles from "../styles/close.module.css";

export type CloseProps = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Close({ onClick }: CloseProps) {
    return (
        <button className={styles.close} onClick={onClick}>
            <Icon icon="ic:round-close" />
        </button>
    );
}

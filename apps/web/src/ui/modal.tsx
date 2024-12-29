import { createPortal } from "react-dom";

type Props = {};

export default function Modal({}: Props) {
    return createPortal(<dialog></dialog>, document.body);
}

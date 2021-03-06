import { Socket } from "socket.io-client";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-styled-components";
import { prompt } from "../constants";
import { SocketContext } from "../context/socket";
import loadActions from "../redux/actions/LoadAction";
import promptActions from "../redux/actions/PromptAction";
import userActions from "../redux/actions/UserAction";
import { RootState } from "../redux/reducers/allReducer";
import { Chat, UserState } from "../redux/reducers/UserReducer";
import { PromptState } from "../redux/reducers/PromptReducer";

const PromptButton = tw.button`
    bg-blue-500
    px-4 py-2
    text-white
    rounded-sm
`;
const Input = tw.input`
    w-full
    outline-none
    border-black
    border
    px-4 py-2
    bg-gray-50
`;

interface ChatForPrompt {
    title: string
    _id: string
}

/**
 * Custom hook for prompt for updating the chat.
 * 
 * @param {ChatForPrompt} chat Chat being viewed.
 * @returns {any} Prompt props
 */
export default function useUpdateChatPrompt(chat: ChatForPrompt) {
    const dispatch = useDispatch();
    const { open, promptToOpen }: PromptState = useSelector((state: RootState) => state.promptReducer);
    const { success, error, isPending } = useSelector((state: RootState) => state.loadReducer);
    const [title, setTitle] = useState(chat.title as string);
    const socket: Socket = useContext(SocketContext);

    /**
     * Responds to the chat being updated.
     * 
     * @param {string} chatId Id of chat to update.
     * @param {string} title New title.
     */
    function onUpdatingChat(chatId: string, title: string) {
        dispatch(loadActions.pending());
        socket.emit("UPDATE_CHAT", {chatId, title});
    }

    useEffect(() => {
        socket.on("ADMIN_UPDATE_CHAT", (updatedChat: Chat) => {
            // Close prompt
            dispatch(loadActions.success(""));
            dispatch(promptActions.close());
        });
    }, []);

    const props = {
        open: open && promptToOpen === prompt.UPDATE_CHAT,
        onClose: () => dispatch(promptActions.close())
    };
    const header = {
        children: "Update Chat"
    };
    const body = {
        children: <Input value={title} onChange={(evt) => setTitle(evt.target.value as string)} />
    };
    const footer = {
        props: {},
        children: <div className="flex justify-center">
            <PromptButton 
                onClick={() => onUpdatingChat(chat._id, title)} 
            >
                Update chat
            </PromptButton>
        </div>
    };
    const message = {
        success: success,
        error: error,
        pending: {
            isPending: isPending,
            message: "Updating chat..."
        }
    };

    return { props, header, body, footer, message };
}
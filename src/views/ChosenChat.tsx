import tw from "tailwind-styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../redux/reducers/allReducer";
import ChatService from "../api/services/ChatService";
import userActions from "../redux/actions/UserAction";
import { format } from "date-fns";

const PromptContainer = tw.div`
    w-full 
    flex
`;
const Prompt = tw.div`
    text-xl
    m-auto
`;

const ChatContainer = tw.div`
    w-4/6 
    relative 
    border-r
`;
const Header = tw.div`
    w-full
    bg-white
    py-3 px-8
    text-xl
`;
const Chat = tw.div`
    overflow-y-auto
    absolute
    w-full
    top-50px
    bottom-60px
`;
const MessageInput = tw.input`
    p-4
    w-full
    rounded
    border
    outline-none
    absolute
    bottom-0
`;

const MessageContainer = tw.div`
    py-4
    px-10
    ${props => props.backgroundColor || ""}
`;
const Username = tw.div`
    text-xs 
    text-gray-500
`;
const MessageDate = tw.div`
    text-xs 
    font-thin 
    text-gray-600
`;

function MessageDisplay({ userId, message, createdAt, loggedInUserId }) {
    const { _id, username } = userId;
    return (
        <MessageContainer backgroundColor={(_id === loggedInUserId) && "bg-blue-200"}>
            <Username>{username}</Username>
            <div className="py-1">{message}</div>
            <MessageDate>
                {format(new Date(createdAt), "PP, p")}
            </MessageDate>
        </MessageContainer>
    );
}

export default function ChosenChat({ chatId }) {
    const { chosenChat, user } = useSelector((state: RootState) => state.userReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        if(chatId) {
            ChatService
                .getChat(chatId)
                .then(response => {
                    dispatch(userActions.setChosenChat(response.data));
                });
        }
    }, [chatId]);

    if(!chosenChat)
        return (
            <PromptContainer>
                <Prompt>
                    Choose a chat and start a conversation.
                </Prompt>
            </PromptContainer>
        );

    const { title, messages } = chosenChat;
    return (
        <ChatContainer>
            <Header>{title}</Header>

            <Chat>
                <div>
                    { 
                        messages.map(message => (
                            <MessageDisplay 
                                {...message} 
                                loggedInUserId={user._id} 
                            />
                        )) 
                    }
                </div>
            </Chat>

            <MessageInput 
                placeholder="Enter message"  
            />
        </ChatContainer>
    );
}
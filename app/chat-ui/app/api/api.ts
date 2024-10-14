import { UserInfo, ConversationRequest, Conversation, Message, CosmosDBHealth, CosmosDBStatus } from "./../api/model/chatModel";
const baseUrl = 'http://127.0.0.1:5000'
export async function conversationApi(options: ConversationRequest, abortSignal: AbortSignal): Promise<Response> {
    const response = await fetch(`${baseUrl}/conversation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            messages: options.messages
        }),
        signal: abortSignal
    });

    return response;
}

export async function getUserInfo(): Promise<UserInfo[]> {
    const response = await fetch('/.auth/me');
    if (!response.ok) {
        console.log("No identity provider found. Access to chat will be blocked.")
        return [];
    }

    const payload = await response.json();
    return payload;
}

// export const fetchChatHistoryInit = async (): Promise<Conversation[] | null> => {
// export const fetchChatHistoryInit = (): Conversation[] | null => {
//     // Make initial API call here

//     // return null;
//     return chatHistorySampleData;
// }

export const historyList = async (offset=0): Promise<Conversation[] | null> => {
    const response = await fetch(`${baseUrl}/history/list?offset=${offset}`, {
        method: "GET",
    }).then(async (res) => {
        const payload = await res.json();
        if (!Array.isArray(payload)) {
            console.error("There was an issue fetching your data.");
            return null;
        }
        const conversations: Conversation[] = await Promise.all(payload.map(async (conv: any) => {
            let convMessages: Message[] = [];
            convMessages = await historyRead(conv.id)
            .then((res) => {
                return res
            })
            .catch((err) => {
                console.error("error fetching messages: ", err)
                return []
            })
            const conversation: Conversation = {
                id: conv.id,
                title: conv.title,
                date: conv.createdAt,
                messages: convMessages
            };
            return conversation;
        }));
        return conversations;
    }).catch((err) => {
        console.error("There was an issue fetching your data.");
        return null
    })

    return response
}

export const historyRead = async (convId: string): Promise<Message[]> => {
    const response = await fetch(`${baseUrl}/history/read`, {
        method: "POST",
        body: JSON.stringify({
            conversation_id: convId
        }),
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(async (res) => {
        if(!res){
            return []
        }
        const payload = await res.json();
        let messages: Message[] = [];
        if(payload?.messages){
            payload.messages.forEach((msg: any) => {
                const message: Message = {
                    id: msg.id,
                    role: msg.role,
                    date: msg.createdAt,
                    content: msg.content,
                    feedback: msg.feedback ?? undefined
                }
                messages.push(message)
            });
        }
        return messages;
    }).catch((err) => {
        console.error("There was an issue fetching your data.");
        return []
    })
    return response
}

export const historyGenerate = async (options: ConversationRequest, abortSignal: AbortSignal, convId?: string): Promise<Response> => {
    let body;
    if(convId){
        body = JSON.stringify({
            conversation_id: convId,
            messages: options.messages
        })
    }else{
        body = JSON.stringify({
            messages: options.messages
        })
    }
    const response = await fetch(`${baseUrl}/history/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body,
        signal: abortSignal
    }).then((res) => {
        return res
    })
    .catch((err) => {
        console.error("There was an issue fetching your data.");
        return new Response;
    })
    return response
}

export const historyUpdate = async (messages: Message[], convId: string): Promise<Response> => {
    const response = await fetch(`${baseUrl}/history/update`, {
        method: "POST",
        body: JSON.stringify({
            conversation_id: convId,
            messages: messages
        }),
        headers: {
            "Content-Type": "application/json"
        },
    }).then(async (res) => {
        return res
    })
    .catch((err) => {
        console.error("There was an issue fetching your data.");
        let errRes: Response = {
            ...new Response,
            ok: false,
            status: 500,
        }
        return errRes;
    })
    return response
}

export const historyDelete = async (convId: string) : Promise<Response> => {
    const response = await fetch(`${baseUrl}/history/delete`, {
        method: "DELETE",
        body: JSON.stringify({
            conversation_id: convId,
        }),
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then((res) => {
        return res
    })
    .catch((err) => {
        console.error("There was an issue fetching your data.");
        let errRes: Response = {
            ...new Response,
            ok: false,
            status: 500,
        }
        return errRes;
    })
    return response;
}

export const historyDeleteAll = async () : Promise<Response> => {
    const response = await fetch(`${baseUrl}/history/delete_all`, {
        method: "DELETE",
        body: JSON.stringify({}),
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then((res) => {
        return res
    })
    .catch((err) => {
        console.error("There was an issue fetching your data.");
        let errRes: Response = {
            ...new Response,
            ok: false,
            status: 500,
        }
        return errRes;
    })
    return response;
}

export const historyClear = async (convId: string) : Promise<Response> => {
    const response = await fetch(`${baseUrl}/history/clear`, {
        method: "POST",
        body: JSON.stringify({
            conversation_id: convId,
        }),
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then((res) => {
        return res
    })
    .catch((err) => {
        console.error("There was an issue fetching your data.");
        let errRes: Response = {
            ...new Response,
            ok: false,
            status: 500,
        }
        return errRes;
    })
    return response;
}

export const historyRename = async (convId: string, title: string) : Promise<Response> => {
    const response = await fetch(`${baseUrl}/history/rename`, {
        method: "POST",
        body: JSON.stringify({
            conversation_id: convId,
            title: title
        }),
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then((res) => {
        return res
    })
    .catch((err) => {
        console.error("There was an issue fetching your data.");
        let errRes: Response = {
            ...new Response,
            ok: false,
            status: 500,
        }
        return errRes;
    })
    return response;
}

export const historyEnsure = async (): Promise<CosmosDBHealth> => {
    const response = await fetch(`${baseUrl}/history/ensure`, {
        method: "GET",
    })
    .then(async res => {
        let respJson = await res.json();
        let formattedResponse;
        if(respJson.message){
            formattedResponse = CosmosDBStatus.Working
        }else{
            if(res.status === 500){
                formattedResponse = CosmosDBStatus.NotWorking
            }else{
                formattedResponse = CosmosDBStatus.NotConfigured
            }
        }
        if(!res.ok){
            return {
                cosmosDB: false,
                status: formattedResponse
            }
        }else{
            return {
                cosmosDB: true,
                status: formattedResponse
            }
        }
    })
    .catch((err) => {
        console.error("There was an issue fetching your data.");
        return {
            cosmosDB: false,
            status: err
        }
    })
    return response;
}

export const frontendSettings = async (): Promise<Response | null> => {
    const response = await fetch(`${baseUrl}/frontend_settings`, {
        method: "GET",
    }).then((res) => {
        return res.json()
    }).catch((err) => {
        console.error("There was an issue fetching your data.");
        return null
    })

    return response
}
export const historyMessageFeedback = async (messageId: string, feedback: string): Promise<Response> => {
    const response = await fetch(`${baseUrl}/history/message_feedback`, {
        method: "POST",
        body: JSON.stringify({
            message_id: messageId,
            message_feedback: feedback
        }),
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then((res) => {
        return res
    })
    .catch((err) => {
        console.error("There was an issue logging feedback.");
        let errRes: Response = {
            ...new Response,
            ok: false,
            status: 500,
        }
        return errRes;
    })
    return response;
}

export const loadAssistants = async (userId?: string) => {
    const botAssistants = [
        {
            id: "1",
            name: "Enterprise Engineering",
            avatar: "", // Path to May GPT's avatar image
            role: "Personal Finance Assistant",
            description: "Your intelligent virtual assistant powered by AI technology.",
        },
        {
            id: "2",
            name: "Etiqa",
            avatar: "/avatars/ada-ai-avatar.png", // Path to Ada AI's avatar image
            role: "Financial Advisor",
            description: "An AI-powered financial advisor to help you make informed decisions.",
        },
        // Add more bot assistants as needed
    ];

    // Return the list of AI bot assistants
    return botAssistants;
}

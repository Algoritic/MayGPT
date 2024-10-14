'use client'

import { Message, Conversation, ConversationRequest, ChatResponse, ErrorMessage } from '@/app/api/model/chatModel'
import { useRef, useState, useEffect, useContext, useLayoutEffect } from "react";

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { conversationApi, historyGenerate, historyClear, historyUpdate } from '@/app/api/api'
import { isEmpty } from 'lodash-es'
import { AppStateContext } from '@/lib/AppProvider';
const enum messageStatus {
  NotRunning = "Not Running",
  Processing = "Processing",
  Done = "Done"
}
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const appStateContext = useContext(AppStateContext)
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [ASSISTANT, TOOL, ERROR] = ["assistant", "tool", "error"]
  const [stopChatGenerating, setStopChatGenerating] = useState<boolean>(false);
  const [processMessages, setProcessMessages] = useState<messageStatus>(messageStatus.NotRunning);
  const abortFuncs = useRef([] as AbortController[]);

  let assistantMessage = {} as Message
  let toolMessage = {} as Message
  let assistantContent = ""

  useEffect(() => {
    console.log('reached here188', stopChatGenerating)
  }, [stopChatGenerating]);

  const processResultMessage = (resultMessage: Message, userMessage: Message, conversationId?: string) => {
    if (resultMessage.role === ASSISTANT) {
      assistantContent += resultMessage.content
      assistantMessage = resultMessage
      assistantMessage.content = assistantContent
    }

    if (resultMessage.role === TOOL) toolMessage = resultMessage

    if (!conversationId) {
      isEmpty(toolMessage) ?
        setMessages([...messages, userMessage, assistantMessage]) :
        setMessages([...messages, userMessage, toolMessage, assistantMessage]);
    } else {
      isEmpty(toolMessage) ?
        setMessages([...messages, assistantMessage]) :
        setMessages([...messages, toolMessage, assistantMessage]);
    }
  }

  const makeApiRequestWithoutCosmosDB = async (question: string, conversationId?: string) => {
    setStopChatGenerating(false)
    setIsLoading(true);
    const abortController = new AbortController();
    abortFuncs.current.unshift(abortController);

    const userMessage: Message = {
      id: id,
      role: "user",
      content: question,
      date: new Date().toISOString(),
    };

    let conversation: Conversation | null | undefined;
    if (!conversationId) {
      conversation = {
        id: conversationId ?? id,
        title: question,
        messages: [userMessage],
        date: new Date().toISOString(),
      }
    } else {
      conversation = appStateContext?.state?.currentChat
      if (!conversation) {
        console.error("Conversation not found.");
        setIsLoading(false);
        abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
        return;
      } else {
        conversation.messages.push(userMessage);
      }
    }
    appStateContext?.dispatch({ type: 'UPDATE_CURRENT_CHAT', payload: conversation });
    setMessages(conversation.messages)

    const request: ConversationRequest = {
      messages: [...conversation.messages.filter((answer) => answer.role !== ERROR)]
    };

    let result = {} as ChatResponse;
    try {
      const response = await conversationApi(request, abortController.signal);
      if (response?.body) {
        const reader = response.body.getReader();
        let runningText = "";

        while (true) {
          setProcessMessages(messageStatus.Processing)
          const { done, value } = await reader.read();
          if (done) break;

          var text = new TextDecoder("utf-8").decode(value);
          const objects = text.split("\n");
          objects.forEach((obj) => {
            try {
              runningText += obj;
              result = JSON.parse(runningText);
              result.choices[0].messages.forEach((obj) => {
                obj.id = result.id;
                obj.date = new Date().toISOString();
              })
              result.choices[0].messages.forEach((resultObj) => {
                processResultMessage(resultObj, userMessage, conversationId);
              })
              runningText = "";
            }
            catch { }
          });
        }
        conversation.messages.push(toolMessage, assistantMessage)
        appStateContext?.dispatch({ type: 'UPDATE_CURRENT_CHAT', payload: conversation });
        setMessages([...messages, toolMessage, assistantMessage]);
      }

    } catch (e) {
      if (!abortController.signal.aborted) {
        let errorMessage = "An error occurred. Please try again. If the problem persists, please contact the site administrator.";
        if (result.error?.message) {
          errorMessage = result.error.message;
        }
        else if (typeof result.error === "string") {
          errorMessage = result.error;
        }
        let errorChatMsg: Message = {
          id: id,
          role: ERROR,
          content: errorMessage,
          date: new Date().toISOString()
        }
        conversation.messages.push(errorChatMsg);
        appStateContext?.dispatch({ type: 'UPDATE_CURRENT_CHAT', payload: conversation });
        setMessages([...messages, errorChatMsg]);
      } else {
        setMessages([...messages, userMessage])
      }
    } finally {
      setIsLoading(false);
      abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
      setProcessMessages(messageStatus.Done)
    }

    return abortController.abort();
  };

  const makeApiRequestWithCosmosDB = async (question: string, conversationId?: string) => {
    console.log('reached here cosmos', conversationId);
    setStopChatGenerating(false)
    setIsLoading(true);
    const abortController = new AbortController();
    abortFuncs.current.unshift(abortController);

    const userMessage: Message = {
      id: id,
      role: "user",
      content: question,
      date: new Date().toISOString(),
    };

    //api call params set here (generate)
    let request: ConversationRequest;
    let conversation;
    if (conversationId) {
      conversation = appStateContext?.state?.chatHistory?.find((conv) => conv.id === conversationId)
      if (!conversation) {
        console.error("Conversation not found.");
        setIsLoading(false);
        abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
        return;
      } else {
        conversation.messages.push(userMessage);
        request = {
          messages: [...conversation.messages.filter((answer) => answer.role !== ERROR)]
        };
      }
    } else {
      request = {
        messages: [userMessage].filter((answer) => answer.role !== ERROR)
      };
      setMessages(request.messages)
    }
    let result = {} as ChatResponse;
    try {
      const response = conversationId ? await historyGenerate(request, abortController.signal, conversationId) : await historyGenerate(request, abortController.signal);
      if (!response?.ok) {
        let errorChatMsg: Message = {
          id: id,
          role: ERROR,
          content: "There was an error generating a response. Chat history can't be saved at this time. If the problem persists, please contact the site administrator.",
          date: new Date().toISOString()
        }
        let resultConversation;
        if (conversationId) {
          resultConversation = appStateContext?.state?.chatHistory?.find((conv) => conv.id === conversationId)
          if (!resultConversation) {
            console.error("Conversation not found.");
            setIsLoading(false);
            abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
            return;
          }
          resultConversation.messages.push(errorChatMsg);
        } else {
          setMessages([...messages, userMessage, errorChatMsg])
          setIsLoading(false);
          abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
          return;
        }
        appStateContext?.dispatch({ type: 'UPDATE_CURRENT_CHAT', payload: resultConversation });
        setMessages([...resultConversation.messages]);
        return;
      }
      if (response?.body) {
        const reader = response.body.getReader();
        let runningText = "";

        while (true) {
          setProcessMessages(messageStatus.Processing)
          const { done, value } = await reader.read();
          if (done) break;

          var text = new TextDecoder("utf-8").decode(value);
          const objects = text.split("\n");
          objects.forEach((obj) => {
            try {
              runningText += obj;
              result = JSON.parse(runningText);
              result.choices[0].messages.forEach((obj) => {
                obj.id = result.id;
                obj.date = new Date().toISOString();
              })
              result.choices[0].messages.forEach((resultObj) => {
                processResultMessage(resultObj, userMessage, conversationId);
              })
              runningText = "";
            }
            catch { }
          });
        }

        let resultConversation;
        if (conversationId) {
          resultConversation = appStateContext?.state?.chatHistory?.find((conv) => conv.id === conversationId)
          if (!resultConversation) {
            console.error("Conversation not found.");
            setIsLoading(false);
            abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
            return;
          }
          isEmpty(toolMessage) ?
            resultConversation.messages.push(assistantMessage) :
            resultConversation.messages.push(toolMessage, assistantMessage)
        } else {
          resultConversation = {
            id: result.history_metadata.conversation_id,
            title: result.history_metadata.title,
            messages: [userMessage],
            date: result.history_metadata.date
          }
          isEmpty(toolMessage) ?
            resultConversation.messages.push(assistantMessage) :
            resultConversation.messages.push(toolMessage, assistantMessage)
        }
        if (!resultConversation) {
          setIsLoading(false);
          abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
          return;
        }
        appStateContext?.dispatch({ type: 'UPDATE_CURRENT_CHAT', payload: resultConversation });
        isEmpty(toolMessage) ?
          setMessages([...messages, assistantMessage]) :
          setMessages([...messages, toolMessage, assistantMessage]);
      }

    } catch (e) {
      if (!abortController.signal.aborted) {
        let errorMessage = "An error occurred. Please try again. If the problem persists, please contact the site administrator.";
        if (result.error?.message) {
          errorMessage = result.error.message;
        }
        else if (typeof result.error === "string") {
          errorMessage = result.error;
        }
        let errorChatMsg: Message = {
          id: id,
          role: ERROR,
          content: errorMessage,
          date: new Date().toISOString()
        }
        let resultConversation;
        if (conversationId) {
          resultConversation = appStateContext?.state?.chatHistory?.find((conv) => conv.id === conversationId)
          if (!resultConversation) {
            console.error("Conversation not found.");
            setIsLoading(false);
            abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
            return;
          }
          resultConversation.messages.push(errorChatMsg);
        } else {
          if (!result.history_metadata) {
            console.error("Error retrieving data.", result);
            setIsLoading(false);
            abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
            return;
          }
          resultConversation = {
            id: result.history_metadata.conversation_id,
            title: result.history_metadata.title,
            messages: [userMessage],
            date: result.history_metadata.date
          }
          resultConversation.messages.push(errorChatMsg);
        }
        if (!resultConversation) {
          setIsLoading(false);
          abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
          return;
        }
        appStateContext?.dispatch({ type: 'UPDATE_CURRENT_CHAT', payload: resultConversation });
        setMessages([...messages, errorChatMsg]);
      } else {
        setMessages([...messages, userMessage])
      }
    } finally {
      setIsLoading(false);
      abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
      setProcessMessages(messageStatus.Done)
    }
    return abortController.abort();

  }

  useLayoutEffect(() => {
    const saveToDB = async (messages: Message[], id?: string) => {
      const response = await historyUpdate(messages, id ?? '')
      return response
    }

    if (appStateContext && appStateContext.state.currentChat && processMessages === messageStatus.Done) {
      if (appStateContext.state.isCosmosDBAvailable.cosmosDB) {
        if (!appStateContext?.state.currentChat?.messages) {
          console.error("Failure fetching current chat state.")
          return
        }
        saveToDB(appStateContext.state.currentChat.messages, appStateContext.state.currentChat.id)
          .then((res) => {
            if (!res.ok) {
              let errorMessage = "An error occurred. Answers can't be saved at this time. If the problem persists, please contact the site administrator.";
              let errorChatMsg: Message = {
                id: id,
                role: ERROR,
                content: errorMessage,
                date: new Date().toISOString()
              }
              if (!appStateContext?.state.currentChat?.messages) {
                let err: Error = {
                  ...new Error,
                  message: "Failure fetching current chat state."
                }
                throw err
              }
              setMessages([...appStateContext?.state.currentChat?.messages, errorChatMsg])
            }
            return res as Response
          })
          .catch((err) => {
            console.error("Error: ", err)
            let errRes: Response = {
              ...new Response,
              ok: false,
              status: 500,
            }
            return errRes;
          })
      } else {
      }
      appStateContext?.dispatch({ type: 'UPDATE_CHAT_HISTORY', payload: appStateContext.state.currentChat });
      setMessages(appStateContext.state.currentChat.messages)
      setProcessMessages(messageStatus.NotRunning)
    }
  }, [processMessages]);


  // const clearChat = async () => {
  //     setClearingChat(true)
  //     if (appStateContext?.state.currentChat?.id && appStateContext?.state.isCosmosDBAvailable.cosmosDB) {
  //         let response = await historyClear(appStateContext?.state.currentChat.id)
  //         if (!response.ok) {
  //             setErrorMsg({
  //                 title: "Error clearing current chat",
  //                 subtitle: "Please try again. If the problem persists, please contact the site administrator.",
  //             })
  //             toggleErrorDialog();
  //         } else {
  //             appStateContext?.dispatch({ type: 'DELETE_CURRENT_CHAT_MESSAGES', payload: appStateContext?.state.currentChat.id });
  //             appStateContext?.dispatch({ type: 'UPDATE_CHAT_HISTORY', payload: appStateContext?.state.currentChat });
  //             setActiveCitation(undefined);
  //             setIsCitationPanelOpen(false);
  //             setMessages([])
  //         }
  //     }
  //     setClearingChat(false)
  // };

  const newChat = () => {
      setProcessMessages(messageStatus.Processing)
      setMessages([])
      appStateContext?.dispatch({ type: 'UPDATE_CURRENT_CHAT', payload: null });
      setProcessMessages(messageStatus.Done)
  };

  const stopGenerating = () => {
    abortFuncs.current.forEach(a => a.abort());
    setStopChatGenerating(true);
    setIsLoading(false);
  }

  useEffect(() => {
    if (appStateContext?.state.currentChat) {
      setMessages(appStateContext.state.currentChat.messages)
    } else {
      setMessages([])
    }
  }, [appStateContext?.state.currentChat]);


  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} stopChatGeneration={stopChatGenerating} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        messages={messages}
        input={input}
        setInput={setInput}
        onSendMessage={(question, id) => {
          appStateContext?.state.isCosmosDBAvailable?.cosmosDB ? makeApiRequestWithCosmosDB(question, id) : makeApiRequestWithoutCosmosDB(question, id)
        }}
        stopGenerating={stopGenerating}
        conversationId={appStateContext?.state.currentChat?.id ? appStateContext?.state.currentChat?.id : undefined}
        newChat={newChat}
      />
    </>
  );
}
import { useState } from 'react';
import { Dialog, CommandBarButton } from '@fluentui/react';
import styles from './ChatFeedbackButton.module.css';

const ChatFeedbackButton = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const surveyUrl = 'https://mpulse.maybanksandbox.com/chatbot';
  
  // This function toggles the visibility of the dialog
  const showDialog = () => {
    setIsDialogVisible(true);
  };

  // This function closes the dialog
  const closeDialog = () => {
    setIsDialogVisible(false);
  };

  return (
    <>
      <CommandBarButton
        iconProps={{ iconName: 'Feedback' }} // Make sure to use an existing icon name
        title="Feedback"
        ariaLabel="Feedback"
        text="Feedback"
        className={styles.chatButton}
        onClick={showDialog} // Here we call the showDialog function when the button is clicked
      />
      <Dialog
        hidden={!isDialogVisible}
        onDismiss={closeDialog}
        dialogContentProps={{
          title: 'Feedback',
          showCloseButton: true
        }}
        styles={{
            main: [
                {
                selectors: {
                    ['@media (min-width: 480px)']: {
                        minWidth: '1200px',
                        background: "#FFFFFF",
                        boxShadow: "0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                        borderRadius: "8px",
                        maxHeight: '600px',
                        minHeight: '100px',
                    }
                },
            },
        ]
        }}
      >
       <iframe src={surveyUrl} width="100%" height="1000" frameBorder="0" title="MPulse Survey" />
      </Dialog>
    </>
  );
};

export default ChatFeedbackButton;

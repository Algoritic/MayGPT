import { CommandBarButton, DefaultButton, IButtonProps, IButtonStyles, ICommandBarStyles } from "@fluentui/react";

interface ShareButtonProps extends IButtonProps {
    onClick: () => void;
  }

export const ShareButton: React.FC<ShareButtonProps> = ({onClick}) => {
    const shareButtonStyles: ICommandBarStyles & IButtonStyles = {
        root: {
          width: 86,
          height: 32,
          borderRadius: 4,
          background: 'radial-gradient(109.81% 107.82% at 100.1% 90.19%, rgb(255, 197, 0) 33.63%, rgb(255, 214, 107) 70.31%, rgb(255, 224, 158) 100%)',
        //   position: 'absolute',
        //   right: 20,
          padding: '5px 12px',
          marginRight: '20px'
        },
        icon: {
          color: '#FFFFFF',
        },
        rootHovered: {
          background: 'linear-gradient(135deg, rgb(255, 197, 0) 0%, rgb(255, 212, 85) 51.04%, rgb(255, 228, 130) 100%)',
        },
        label: {
          fontWeight: 600,
          fontSize: 14,
          lineHeight: '20px',
          color: '#FFFFFF',
        },
      };

      return (
        <CommandBarButton
                styles={shareButtonStyles}
                iconProps={{ iconName: 'Share' }}
                onClick={onClick}
                text="Share"
        />
      )
}

interface HistoryButtonProps extends IButtonProps {
    onClick: () => void;
    text: string;
  }

export const HistoryButton: React.FC<HistoryButtonProps> = ({onClick, text}) => {
    const historyButtonStyles: ICommandBarStyles & IButtonStyles = {
        root: {
            width: '180px',
            border: `1px solid #D1D1D1`,
          },
          rootHovered: {
            border: `1px solid #D1D1D1`,
          },
          rootPressed: {
            border: `1px solid #D1D1D1`,
          },
      };

      return (
        <DefaultButton
            text={text}
            iconProps={{ iconName: 'History' }}
            onClick={onClick}
            styles={historyButtonStyles}
        />
      )
}

export const AssistantButton: React.FC<ShareButtonProps> = ({onClick}) => {
  const shareButtonStyles: ICommandBarStyles & IButtonStyles = {
      root: {
        height: 32,
        borderRadius: 4,
        background: 'radial-gradient(109.81% 107.82% at 100.1% 90.19%, rgb(255, 197, 0) 33.63%, rgb(255, 214, 107) 70.31%, rgb(255, 224, 158) 100%)',
        padding: '5px 12px',
        marginRight: '20px'
      },
      icon: {
        color: '#FFFFFF',
      },
      rootHovered: {
        background: 'linear-gradient(135deg, rgb(255, 197, 0) 0%, rgb(255, 212, 85) 51.04%, rgb(255, 228, 130) 100%)',
      },
      label: {
        fontWeight: 600,
        fontSize: 14,
        lineHeight: '20px',
        color: '#FFFFFF',
      },
    };

    return (
      <CommandBarButton
              styles={shareButtonStyles}
              iconProps={{ iconName: 'Home' }}
              onClick={onClick}
              text="Other Assistants"
      />
    )
}

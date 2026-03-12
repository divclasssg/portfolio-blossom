import styles from './ChatArea.module.scss';
import SeverityChips from '../SeverityChips/SeverityChips';

// 포트폴리오 데모용 정적 대화 — 심계항진 증상 시나리오 (윤서진)
const DEMO_MESSAGES = [
  {
    type: 'bot',
    text: '안녕하세요 윤서진님!\n어떤 증상이 있으신가요?',
  },
  {
    type: 'user',
    text: '가슴이 답답하고 숨이 좀 차는 느낌이에요. 심장이 빨리 뛰는 것 같기도 하고요.',
  },
  {
    type: 'bot',
    text: '가슴이 답답하고 심장이 빨리 뛰는 느낌이시군요.\n증상의 강도를 선택해 주세요.',
    showSeverityChips: true,
  },
];

export default function ChatArea() {
  return (
    <div className={styles['chat-area']} aria-label="증상 기록 대화">
      {DEMO_MESSAGES.map((msg, i) => (
        <div
          key={i}
          className={styles[msg.type === 'bot' ? 'message-bot' : 'message-user']}
        >
          {msg.type === 'bot' && (
            <span className={styles['bot-label']} aria-hidden="true">Eum</span>
          )}
          <div className={styles[msg.type === 'bot' ? 'bubble-bot' : 'bubble-user']}>
            {msg.text.split('\n').map((line, j, arr) => (
              <span key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))}
          </div>
          {msg.showSeverityChips && <SeverityChips />}
        </div>
      ))}
    </div>
  );
}

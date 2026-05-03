import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

/**
 * Renders a single question card for the quiz.
 * @param {Object} props - Component props.
 * @param {Object} props.q - The question object.
 * @param {number} props.currentIdx - Current question index.
 * @param {number} props.total - Total number of questions.
 * @param {string} props.difficulty - Difficulty level.
 * @param {number} props.selectedOpt - Selected option index.
 * @param {boolean} props.showExpl - Whether to show explanation.
 * @param {Function} props.onSelect - Option select handler.
 * @param {Function} props.onNext - Next button handler.
 * @param {boolean} props.isLast - Whether this is the last question.
 * @returns {JSX.Element} QuestionCard component.
 */
const QuestionCard = ({ q, currentIdx, total, difficulty, selectedOpt, showExpl, onSelect, onNext, isLast }) => {
  return (
    <div className="space-y-6 relative h-full">
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span className="capitalize">{difficulty} Level</span>
        <span>{currentIdx + 1} / {total}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-saffron transition-all duration-300" style={{ width: `${((currentIdx) / total) * 100}%` }}></div>
      </div>

      <motion.div
        key={currentIdx}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className="bg-dark-card border border-gray-800 p-6 rounded-xl space-y-6"
      >
        <h3 id="question-text" className="text-xl font-medium text-white leading-tight" aria-label={`Question ${currentIdx + 1} of ${total}`}>{q.text}</h3>
        
        <div className="space-y-3" role="radiogroup" aria-labelledby="question-text">
          {q.options.map((opt, i) => {
            const isSelected = selectedOpt === i;
            const isCorrect = q.correct === i;
            let btnClass = "bg-dark-bg border-gray-700 hover:border-gray-500 text-gray-300";
            
            if (showExpl) {
              if (isCorrect) btnClass = "bg-green/20 border-green text-green";
              else if (isSelected && !isCorrect) btnClass = "bg-red-500/20 border-red-500 text-red-500";
              else btnClass = "bg-dark-bg border-gray-800 text-gray-600 opacity-50";
            }

            return (
              <button
                key={i}
                role="radio"
                aria-checked={isSelected ? "true" : "false"}
                disabled={showExpl}
                onClick={() => onSelect(i)}
                aria-describedby={showExpl ? "expl-text" : undefined}
                className={`w-full text-left p-4 rounded-lg border transition flex justify-between items-center ${btnClass}`}
              >
                <span>{opt}</span>
                {showExpl && isCorrect && <CheckCircle2 size={18} className="text-green" />}
                {showExpl && isSelected && !isCorrect && <XCircle size={18} className="text-red-500" />}
              </button>
            )
          })}
        </div>

        <AnimatePresence>
          {showExpl && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4" role="alert" aria-live="assertive">
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-400">Explanation</p>
                <p id="expl-text" className="text-sm text-gray-300 mt-1">{q.expl}</p>
              </div>
              <button
                onClick={onNext}
                className="mt-6 w-full bg-saffron text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition"
              >
                {isLast ? 'See Results' : 'Next Question'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

QuestionCard.propTypes = {
  q: PropTypes.object.isRequired,
  currentIdx: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  difficulty: PropTypes.string.isRequired,
  selectedOpt: PropTypes.number,
  showExpl: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isLast: PropTypes.bool.isRequired
};

QuestionCard.defaultProps = {
  selectedOpt: null
};

export default React.memo(QuestionCard);


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MissingFact } from "@/lib/facts";
import { Sparkles, ArrowRight } from "lucide-react";

interface ClarificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    missingFacts: MissingFact[];
    onConfirm: (answers: Record<string, string>) => void;
    isLoading?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ClarificationModal({ isOpen, onClose, missingFacts, onConfirm, isLoading }: ClarificationModalProps) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const currentFact = missingFacts[0]; // Focus on first one

    if (!currentFact) return null;

    const handleAnswerChange = (val: string) => {
        setAnswers(prev => ({ ...prev, [currentFact.id]: val }));
    };

    const handleSubmit = () => {
        onConfirm(answers);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md border-indigo-100 shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold text-slate-800">
                        잠시만요! 🙋‍♂️
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-600 pt-2">
                        완벽한 문구를 위해 딱 한 가지만 더 알려주세요.<br />
                        (입력해주시면 AI 정확도가 <strong>200%</strong> 올라갑니다)
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <label className="text-sm font-bold text-indigo-900 block mb-2">
                            Q. {currentFact.question}
                        </label>

                        {currentFact.type === 'yesno' ? (
                            <div className="flex gap-2">
                                <Button
                                    variant={answers[currentFact.id] === '가능/있음' ? "default" : "outline"}
                                    onClick={() => handleAnswerChange('가능/있음')}
                                    className="flex-1"
                                >
                                    네, 있어요 ⭕
                                </Button>
                                <Button
                                    variant={answers[currentFact.id] === '불가능/없음' ? "default" : "outline"}
                                    onClick={() => handleAnswerChange('불가능/없음')}
                                    className="flex-1"
                                >
                                    아니요 ❌
                                </Button>
                            </div>
                        ) : (
                            <Input
                                placeholder="예: 짬뽕, 돈까스 (자유롭게 입력)"
                                value={answers[currentFact.id] || ""}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                autoFocus
                                className="bg-white"
                            />
                        )}
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-col gap-2">
                    <Button onClick={handleSubmit} className="w-full text-lg h-12 font-bold bg-indigo-600 hover:bg-indigo-700">
                        입력하고 결과 보기 <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="ghost" onClick={() => onConfirm({})} className="w-full text-xs text-slate-400">
                        건너뛰고 그냥 만들기 (추천하지 않음)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

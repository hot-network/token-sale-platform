import React from 'react';

interface AnimatedCreditCardProps {
    isFlipped: boolean;
    cardNumber: string;
    cardName: string;
    cardExpiry: string;
    cardCvv: string;
}

const AnimatedCreditCard: React.FC<AnimatedCreditCardProps> = ({ isFlipped, cardNumber, cardName, cardExpiry, cardCvv }) => {
    const formatCardNumber = (num: string) => {
        const parts = num.padEnd(16, '#').match(/.{1,4}/g);
        return parts ? parts.join(' ') : '';
    };

    const formatExpiry = (expiry: string) => {
        const month = expiry.slice(0, 2).padEnd(2, 'M');
        const year = expiry.slice(2, 4).padEnd(2, 'Y');
        return `${month}/${year}`;
    };

    return (
        <div className="w-full max-w-sm h-52 sm:h-56 [perspective:1000px]">
            <div 
                className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
            >
                {/* Card Front */}
                <div className="absolute w-full h-full backface-hidden rounded-xl shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 text-white p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <img src="/assets/hot.png" alt="Chip" className="w-12 h-auto opacity-80" />
                        <div className="font-serif text-2xl font-bold">VISA</div>
                    </div>
                    <div className="text-center font-mono tracking-widest text-lg sm:text-xl" aria-hidden="true">
                        {formatCardNumber(cardNumber)}
                    </div>
                    <div className="flex justify-between items-end text-xs sm:text-sm uppercase">
                        <div>
                            <p className="opacity-70 text-xs">Card Holder</p>
                            <p className="font-semibold tracking-wider">{cardName || 'FULL NAME'}</p>
                        </div>
                        <div>
                            <p className="opacity-70 text-xs">Expires</p>
                            <p className="font-semibold tracking-wider">{formatExpiry(cardExpiry)}</p>
                        </div>
                    </div>
                </div>

                {/* Card Back */}
                <div className="absolute w-full h-full backface-hidden rounded-xl shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 text-white p-2 sm:p-4 [transform:rotateY(180deg)]">
                    <div className="w-full h-10 sm:h-12 bg-black mt-4"></div>
                    <div className="text-right px-4 mt-4">
                        <p className="text-xs uppercase opacity-70 mb-1">CVV</p>
                        <div className="h-8 sm:h-9 w-full bg-white rounded-md flex items-center justify-end pr-3 font-mono text-black text-lg">
                            {cardCvv}
                        </div>
                    </div>
                    <div className="font-serif text-lg font-bold text-right px-4 mt-2 sm:mt-4 opacity-80">VISA</div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedCreditCard;
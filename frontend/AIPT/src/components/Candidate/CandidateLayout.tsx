import React, { PropsWithChildren } from 'react';
import CandidateSidebar from './CandidateSidebar';
import CandidateHeader from './CandidateHeader';

const CandidateLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <div className="flex flex-row h-full overflow-hidden ">
            <CandidateSidebar />
            <main className="flex-grow flex flex-col mt-16  bg-[#f9f9f9] overflow-y-auto transition-all duration-300 ease-in-out">
                <CandidateHeader title="Dashboard" />
                <div className="flex-grow overflow-x-auto overflow-y-auto p-20 flex flex-col gap-5 text-center my-5">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default CandidateLayout;
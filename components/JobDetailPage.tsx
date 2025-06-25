// components/JobDetailPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import type { JobRole, StructuredTimetable, TimetablePhase, TimetableWeek, TimetableTask, TimetableResourceSuggestion } from '../types';
import jsPDF from 'jspdf';
// html2canvas is no longer needed for programmatic PDF generation
// import html2canvas from 'html2canvas';

interface JobDetailPageProps {
  job: JobRole;
  generatedTimetable: StructuredTimetable | null;
  onGenerateTimetable: (job: JobRole, timeframe: string) => Promise<void>;
  onBack: () => void;
}

// Sub-component for displaying individual resource suggestions (simplified for programmatic PDF)
const ResourceSuggestionDisplay: React.FC<{ resource: TimetableResourceSuggestion; isPdfMode?: boolean }> = ({ resource }) => (
  <li className={`ml-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400`}>
    <span className="font-semibold">{resource.type}:</span> {resource.details}
  </li>
);

// Sub-component for displaying individual tasks within a week (simplified)
const TaskDisplay: React.FC<{ task: TimetableTask; isPdfMode?: boolean }> = ({ task }) => (
  <div className={`mb-3 pl-4 border-l-2 border-purple-500 dark:border-purple-400`}>
    <p className={`font-medium text-sm sm:text-base text-gray-800 dark:text-gray-100`}>{task.taskDescription}</p>
    {task.skillsToFocus && task.skillsToFocus.length > 0 && (
      <p className={`text-xs sm:text-sm mt-1 text-gray-500 dark:text-gray-400`}>
        <span className="font-semibold">Skills:</span> {task.skillsToFocus.join(', ')}
      </p>
    )}
    {task.suggestedResources && task.suggestedResources.length > 0 && (
      <>
        <p className={`text-xs sm:text-sm mt-1.5 font-semibold text-gray-600 dark:text-gray-300`}>Suggested Resources:</p>
        <ul className="list-disc list-inside mt-1 space-y-0.5">
          {task.suggestedResources.map((res, i) => <ResourceSuggestionDisplay key={i} resource={res} />)}
        </ul>
      </>
    )}
  </div>
);

// Sub-component for displaying a week's plan (simplified)
const WeekDisplay: React.FC<{ week: TimetableWeek; isPdfMode?: boolean }> = ({ week }) => (
  <div className={`week-display-wrapper mb-4 p-4 rounded-lg shadow-inner bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm`}>
    <h5 className={`font-semibold text-base sm:text-lg mb-2 text-purple-600 dark:text-purple-400`}>
      {week.weekRange}: <span className={`font-normal text-gray-700 dark:text-gray-200`}>{week.focusArea}</span>
    </h5>
    <div className="space-y-3">
      {week.tasks.map((task, i) => <TaskDisplay key={i} task={task} />)}
    </div>
  </div>
);

// Sub-component for displaying a phase of the timetable (accordion style)
const PhaseDisplay: React.FC<{ phase: TimetablePhase; isPdfMode?: boolean; defaultOpen?: boolean }> = ({ phase, defaultOpen = false }) => {
  const [isOpenForUi, setIsOpenForUi] = useState(defaultOpen);

  const toggleOpen = () => {
      setIsOpenForUi(!isOpenForUi);
  };

  return (
    <div className={`phase-display-wrapper mb-6 rounded-xl shadow-lg overflow-hidden transition-all duration-300 bg-white dark:bg-slate-700/60 backdrop-blur-md`}>
      <button
        onClick={toggleOpen}
        className={`w-full text-left flex justify-between items-center p-4 sm:p-5 transition-colors duration-200 
                    hover:bg-indigo-50 dark:hover:bg-slate-600/50 ${isOpenForUi ? 'bg-indigo-50 dark:bg-slate-600/30' : 'bg-transparent'}`}
        aria-expanded={isOpenForUi}
      >
        <div className="flex-grow">
          <h4 className={`text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400`}>
            {phase.phaseTitle}
          </h4>
          {phase.phaseDuration && <p className={`text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400`}>{phase.phaseDuration}</p>}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-6 h-6 transform transition-transform duration-300 text-indigo-500 dark:text-indigo-400 ${isOpenForUi ? 'rotate-180' : 'rotate-0'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {phase.summary && (
        <p className={`px-4 sm:px-5 pb-2 text-sm text-gray-600 dark:text-gray-300 ${isOpenForUi ? 'pt-1' : 'pt-0'}`}>
          {phase.summary}
        </p>
      )}
      
      {isOpenForUi && (
        <div className="px-3 sm:px-4 py-3 border-t border-gray-200 dark:border-gray-600/50">
          {phase.weeks.map((week, i) => <WeekDisplay key={i} week={week} />)}
        </div>
      )}
    </div>
  );
};


// Main JobDetailPage component
const JobDetailPage: React.FC<JobDetailPageProps> = ({ job, generatedTimetable, onGenerateTimetable, onBack }) => {
  const [timeframe, setTimeframe] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  // pdfRenderAreaRef and isPdfMode are no longer needed for programmatic PDF generation.

  const handleTimetableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeframe.trim()) {
      onGenerateTimetable(job, timeframe.trim());
    }
  };
  
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    await new Promise(resolve => setTimeout(resolve, 50)); // Brief delay for UI update

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const margin = 40;
    const pageContentWidth = pdf.internal.pageSize.getWidth() - 2 * margin; // 40pt margin on each side
    const pageHeight = pdf.internal.pageSize.getHeight();
    let currentY = margin;

    const addBorder = () => {
      pdf.setDrawColor(150, 150, 150);
      // NEW: inset by full `margin` on all sides
      pdf.rect(
        margin,
        margin,
        pdf.internal.pageSize.getWidth()  - 2 * margin,
        pageHeight - 2 * margin
      );
    };

    const checkAndAddPage = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeight - margin) {
            pdf.addPage();
            addBorder();
            currentY = margin;
        }
    };

    const addWrappedText = (text: string | undefined, x: number, maxWidth: number, options: any = {}, lineHeightFactor = 1.15) => {
        if (!text) return;
        const currentFontSize = options.fontSize || pdf.getFontSize();
        const lineHeight = currentFontSize * lineHeightFactor;
        const lines = pdf.splitTextToSize(text, maxWidth);
        
        lines.forEach((line: string) => {
            checkAndAddPage(lineHeight);
            pdf.text(line, x, currentY, options);
            currentY += lineHeight;
        });
    };
    
    addBorder();
    // NSG Solutions heading
    // set a bold heading
pdf.setFont('helvetica','bold');
pdf.setFontSize(16);

// center it:
const centerX = pdf.internal.pageSize.getWidth() / 2;
checkAndAddPage(20);
pdf.text("NSG Solutions", centerX, currentY, { align: 'center' });
currentY += 25;  // spacing below heading
;

    // Job Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    checkAndAddPage(30);
    addWrappedText(job.title, margin, pageContentWidth, { align: 'left' });
    currentY += 10; // Extra space after title

    // Job Description
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    checkAndAddPage(20);
    addWrappedText(job.description, margin, pageContentWidth);
    currentY += 20;

    // Roadmap
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    checkAndAddPage(25);
    addWrappedText("Your Path to Success!", margin, pageContentWidth);
    currentY += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    checkAndAddPage(20);
    // Split roadmap by newlines for bullet-point like appearance if present
    const roadmapLines = job.roadmap.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    roadmapLines.forEach((line, index) => {
        addWrappedText( (roadmapLines.length > 1 ? `- ${line}` : line), margin, pageContentWidth);
         if (index < roadmapLines.length -1) currentY += 0; // tighter spacing for bullet points
    });
    currentY += 20;

    // Timetable
    if (generatedTimetable) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        checkAndAddPage(30);
        addWrappedText(generatedTimetable.title, margin, pageContentWidth, { align: 'center' });
        currentY += 10;

        if (generatedTimetable.introductoryNote) {
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(10);
            checkAndAddPage(20);
            addWrappedText(generatedTimetable.introductoryNote, margin, pageContentWidth, { align: 'center' });
            currentY += 15;
        }

        generatedTimetable.phases.forEach(phase => {
            checkAndAddPage(25);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(14);
            addWrappedText(phase.phaseTitle, margin, pageContentWidth);
            if (phase.phaseDuration) {
                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'italic');
                addWrappedText(phase.phaseDuration, margin, pageContentWidth);
            }
            if (phase.summary) {
                 pdf.setFontSize(9);
                pdf.setFont('helvetica', 'normal');
                addWrappedText(phase.summary, margin, pageContentWidth);
            }
            currentY += 5;

            phase.weeks.forEach(week => {
                checkAndAddPage(20);
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(11);
                addWrappedText(`${week.weekRange}: ${week.focusArea}`, margin, pageContentWidth);
                currentY += 2;

                week.tasks.forEach(task => {
                    checkAndAddPage(18);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(9);
                    addWrappedText(`- ${task.taskDescription}`, margin + 10, pageContentWidth - 10);
                    
                    if (task.skillsToFocus && task.skillsToFocus.length > 0) {
                        addWrappedText(`  Skills: ${task.skillsToFocus.join(', ')}`, margin + 15, pageContentWidth - 15);
                    }
                    if (task.suggestedResources && task.suggestedResources.length > 0) {
                         addWrappedText(`  Resources:`, margin + 15, pageContentWidth - 15);
                         task.suggestedResources.forEach(res => {
                             addWrappedText(`    • ${res.type}: ${res.details}`, margin + 20, pageContentWidth - 20);
                         });
                    }
                     currentY += 3; // Space after each task
                });
                currentY += 5; // Space after each week
            });
            currentY += 10; // Space after each phase
        });

        if (generatedTimetable.generalTips && generatedTimetable.generalTips.length > 0) {
            checkAndAddPage(25);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            addWrappedText("General Tips for Success:", margin, pageContentWidth);
            currentY += 3;
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            generatedTimetable.generalTips.forEach(tip => {
                addWrappedText(`• ${tip}`, margin, pageContentWidth);
            });
        }
    }

    pdf.save(`${job.title.replace(/\s+/g, '_')}_Plan.pdf`);
    setIsGeneratingPdf(false);
  };

  return (
    <div className={`p-4 sm:p-6 min-h-full flex flex-col bg-gradient-to-br from-indigo-50/70 via-purple-50/70 to-pink-50/70 dark:from-slate-800/80 dark:via-slate-850/80 dark:to-slate-900/80`}>
      <div className="w-full max-w-5xl mx-auto flex-grow">
        <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 no-print">
          <button
            onClick={onBack}
            className="inline-flex items-center px-5 py-2.5 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transform hover:scale-105"
            aria-label="Back to results"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
        </div>

        {/* This div is now primarily for screen display. PDF content is generated programmatically. */}
        <div id="pdf-content-for-screen-display-only" className={`rounded-xl shadow-2xl bg-white dark:bg-slate-700/80 backdrop-blur-lg p-5 sm:p-8`}>
            
            <section className={`mb-8 p-5 sm:p-6 rounded-xl shadow-lg transition-all duration-300 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white`}>
              <h2 className={`text-3xl sm:text-4xl font-extrabold mb-3`}>
                {job.title}
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed opacity-90`}>{job.description}</p>
            </section>

            <section className={`mb-8 p-5 sm:p-6 rounded-xl shadow-lg bg-white dark:bg-slate-700/60`}>
              <h3 className={`text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400`}>
                Your Path to Success!
              </h3>
              <div className={`prose prose-sm sm:prose-base max-w-none whitespace-pre-line leading-relaxed prose-indigo dark:prose-invert dark:text-gray-200`}>
                 <p className={`dark:text-gray-200`}>{job.roadmap || "No specific roadmap provided."}</p>
              </div>
            </section>

            <section className="mb-8 timetable-section">
              {!generatedTimetable && (
                <div className={`p-5 sm:p-6 rounded-xl shadow-lg no-print bg-gradient-to-r from-green-50 via-teal-50 to-cyan-50 dark:from-gray-700 dark:via-gray-750 dark:to-gray-800`}>
                  <h3 className={`text-xl sm:text-2xl font-semibold mb-3 text-green-700 dark:text-green-400`}>Craft Your Personalized Timetable</h3>
                  <p className={`text-sm mb-5 text-gray-600 dark:text-gray-300`}>
                    How much time can you dedicate to this roadmap?
                  </p>
                  <form onSubmit={handleTimetableSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
                    <input
                      type="text"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      placeholder="E.g., 3 months, 1 year dedicated"
                      className={`flex-grow w-full sm:w-auto p-3 border rounded-lg shadow-sm focus:ring-2 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                                  border-gray-300 dark:border-gray-500 focus:ring-green-500 dark:bg-gray-600 focus:border-green-500`}
                      aria-label="Desired timeframe for roadmap completion"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-offset-gray-800 transform hover:scale-105"
                      aria-label="Generate personalized timetable"
                    >
                      Generate Plan
                    </button>
                  </form>
                </div>
              )}

              {generatedTimetable && (
                <div className={`p-3 sm:p-0 rounded-xl`}> 
                  <h3 className={`text-2xl sm:text-3xl font-bold mb-5 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-400 dark:to-cyan-500`}>
                    {generatedTimetable.title}
                  </h3>
                  {generatedTimetable.introductoryNote && (
                    <p className={`text-sm sm:text-base text-center mb-6 italic text-gray-600 dark:text-gray-300`}>
                      {generatedTimetable.introductoryNote}
                    </p>
                  )}
                  
                  {generatedTimetable.phases.map((phase, i) => (
                    <PhaseDisplay key={i} phase={phase} defaultOpen={i === 0} />
                  ))}

                  {generatedTimetable.generalTips && generatedTimetable.generalTips.length > 0 && (
                    <div className={`mt-8 p-4 sm:p-5 rounded-lg bg-white dark:bg-slate-700/60 shadow-md`}>
                      <h4 className={`text-lg sm:text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200`}>
                        General Tips for Success:
                      </h4>
                      <ul className={`list-disc list-inside text-sm sm:text-base space-y-1.5 text-gray-600 dark:text-gray-300`}>
                        {generatedTimetable.generalTips.map((tip, i) => <li key={i}>{tip}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>
        </div> 
        
        
      </div>
    </div>
  );
};

export default JobDetailPage;
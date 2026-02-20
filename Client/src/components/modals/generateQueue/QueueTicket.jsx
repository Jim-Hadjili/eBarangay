import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

/**
 * Opens a 72mm thermal receipt in a popup window and triggers the print dialog.
 * @param {{ queueCode: string, patientName: string, serviceName: string }} queueResult
 */
export function printTicket(queueResult) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const win = window.open("", "_blank", "width=320,height=480");
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Queue Ticket</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Courier New', Courier, monospace;
          width: 72mm;
          padding: 6mm 5mm;
          font-size: 11px;
          color: #000;
        }
        .center { text-align: center; }
        .divider { border-top: 1px dashed #000; margin: 6px 0; }
        .header-title {
          font-size: 13px; font-weight: bold;
          letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2px;
        }
        .subtitle { font-size: 9px; color: #444; margin-bottom: 4px; }
        .queue-code {
          font-size: 42px; font-weight: bold;
          letter-spacing: 4px; line-height: 1.1; margin: 8px 0 4px;
        }
        .label {
          font-size: 9px; text-transform: uppercase;
          letter-spacing: 0.5px; color: #555; margin-bottom: 1px;
        }
        .value { font-size: 12px; font-weight: bold; margin-bottom: 6px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .footer { font-size: 8px; color: #666; margin-top: 4px; }
        @media print { body { width: 72mm; } }
      </style>
    </head>
    <body>
      <div class="center">
        <div class="header-title">eBarangay</div>
        <div class="subtitle">Health Center Queue System</div>
      </div>
      <div class="divider"></div>
      <div class="center">
        <div class="label">Queue Number</div>
        <div class="queue-code">${queueResult.queueCode}</div>
      </div>
      <div class="divider"></div>
      <div class="label">Patient Name</div>
      <div class="value">${queueResult.patientName}</div>
      <div class="label">Service</div>
      <div class="value">${queueResult.serviceName}</div>
      <div class="row">
        <div>
          <div class="label">Date</div>
          <div style="font-size:11px;font-weight:bold">${dateStr}</div>
        </div>
        <div style="text-align:right">
          <div class="label">Time</div>
          <div style="font-size:11px;font-weight:bold">${timeStr}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="center footer">
        Please wait for your number to be called.<br/>
        Thank you for your patience.
      </div>
    </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
  win.close();
}

/**
 * Shared success screen displayed after a queue number is generated.
 * @param {{ queueResult: object, onClose: () => void }} props
 */
export function SuccessScreen({ queueResult, onClose }) {
  return (
    <div className="w-full">
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 border-2 border-green-300">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 font-Lexend mb-1">
          Queue Number Generated!
        </h3>
        <p className="text-sm text-gray-500 font-Lexend mb-6">
          {queueResult.patientName} has been added to the queue.
        </p>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-6 text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-Lexend">
              Queue Number
            </span>
            <span className="text-2xl font-bold font-mono text-gray-900">
              {queueResult.queueCode}
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-Lexend">
              Patient
            </span>
            <span className="text-sm font-semibold text-gray-900 font-Lexend">
              {queueResult.patientName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-Lexend">
              Service
            </span>
            <span className="text-sm font-semibold text-gray-900 font-Lexend">
              {queueResult.serviceName}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => printTicket(queueResult)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 transition-colors cursor-pointer font-Lexend"
          >
            <FontAwesomeIcon icon={faPrint} className="text-sm" />
            Print Ticket
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-Lexend"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

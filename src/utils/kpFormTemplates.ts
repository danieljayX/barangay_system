import { Case } from '../types';

export const getKPForm7Template = (c: Case, summonRemark?: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>KP Form 7 - Summons - Barangay Tablon</title>
        <style>
            @page { size: portrait; margin: 1in; }
            body { font-family: 'Times New Roman', serif; line-height: 1.6; color: #000; padding: 0; }
            .header { text-align: center; margin-bottom: 30px; }
            .header p { margin: 2px 0; font-size: 14px; }
            .header .official { font-weight: bold; font-size: 18px; margin-top: 5px; }
            .form-no { position: absolute; top: 0; left: 0; font-weight: bold; font-size: 14px; }
            
            .title { text-align: center; margin: 40px 0; }
            .title h1 { font-size: 20px; text-decoration: underline; margin-bottom: 5px; }
            .title p { margin: 0; font-style: italic; }

            .case-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .parties { width: 45%; }
            .parties p { margin: 5px 0; }
            .meta { width: 45%; text-align: right; }

            .content { text-align: justify; text-indent: 50px; margin-bottom: 20px; }
            .details-box { border: 1px solid #000; padding: 10px; margin: 10px 0; min-height: 60px; font-style: italic; }
            
            .hearing-details { margin: 20px 0; border: 1px solid #000; padding: 15px; }
            
            .signatures { margin-top: 60px; display: flex; justify-content: space-between; }
            .sig-line { border-top: 1px solid #000; width: 180px; text-align: center; padding-top: 5px; margin-top: 40px; }
            
            .footer { margin-top: 40px; font-size: 12px; font-style: italic; text-align: center; }
            @media print { .no-print { display: none; } }
        </style>
    </head>
    <body>
        <div class="form-no">KP Form No. 7</div>
        <div class="header">
            <p>Republic of the Philippines</p>
            <p>Province of Misamis Oriental</p>
            <p>City of Cagayan de Oro</p>
            <p class="official">BARANGAY TABLON</p>
            <p>OFFICE OF THE LUPONG TAGAPAMAYAPA</p>
        </div>

        <div class="case-info">
            <div class="parties">
                <p><strong>${c.complainantName.toUpperCase()}</strong></p>
                <p style="font-size: 12px;">Complainant/s</p>
                <p>--- against ---</p>
                <p><strong>${c.respondentName.toUpperCase()}</strong></p>
                <p style="font-size: 12px;">Respondent/s</p>
            </div>
            <div class="meta">
                <p>BARANGAY CASE NO. <strong>${c.docketNo || 'N/A'}</strong></p>
                <p>FOR: <strong>${c.complaintType.toUpperCase()}</strong></p>
            </div>
        </div>

        <div class="title">
            <h1>S U M M O N S</h1>
            <p>(PATAWAG)</p>
        </div>

        <div class="content">
            You are hereby summoned to appear before me in person, together with your witnesses, on the date and time specified below, then and there to answer a complaint made before me, copy of which is attached hereto, for mediation/conciliation of your dispute with complainant/s.
        </div>

        ${summonRemark ? `
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">REMARKS / ADDITIONAL INFO:</div>
        <div class="details-box">
            ${summonRemark}
        </div>
        ` : ''}

        <div class="hearing-details">
            <div style="margin-bottom: 10px; font-weight: bold;">HEARING SCHEDULE:</div>
            <p><strong>DATE:</strong> ____________________________</p>
            <p><strong>TIME:</strong> ____________________________</p>
            <p><strong>PLACE:</strong> Barangay Hall, Tablon, Cagayan de Oro City</p>
        </div>

        <div class="content">
            You are hereby warned that if you fail or refuse to appear without justifiable cause, you may be barred from filing any counterclaim arising out of said complaint.
        </div>

        <div class="signatures">
            <div>
                <p>Received this ____ day of ________, 202___</p>
                <div class="sig-line">Respondent/s Signature</div>
            </div>
            <div>
                <p>Issued this ____ day of ________, 202___</p>
                <div class="sig-line"><strong>HON. LUPON CHAIRMAN</strong><br/>Lupon Chairman</div>
            </div>
        </div>

        <div class="footer">
            "Serving with Integrity and Justice for Barangay Tablon"
        </div>
    </body>
    </html>
    `;
};

export const getKPForm16Template = (c: Case, agreementDetails?: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>KP Form 16 - Amicable Settlement - Barangay Tablon</title>
        <style>
            @page { size: portrait; margin: 1in; }
            body { font-family: 'Times New Roman', serif; line-height: 1.5; color: #000; padding: 0; }
            .header { text-align: center; margin-bottom: 20px; }
            .header p { margin: 1px 0; font-size: 12px; }
            .header .official { font-weight: bold; font-size: 16px; margin-top: 5px; }
            .form-no { position: absolute; top: 0; left: 0; font-weight: bold; font-size: 12px; }
            
            .title { text-align: center; margin: 20px 0; }
            .title h1 { font-size: 18px; text-decoration: underline; margin-bottom: 5px; }
            
            .case-info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; }
            .parties { width: 45%; }
            .meta { width: 45%; text-align: right; }

            .settlement-body { text-align: justify; margin-bottom: 30px; font-size: 14px; }
            .agreement-box { border: 1.5px solid #000; min-height: 200px; padding: 20px; margin: 15px 0; }
            
            .signatures-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; }
            .sig-block { text-align: center; }
            .sig-line { border-top: 1px solid #000; margin-top: 40px; padding-top: 5px; font-weight: bold; font-size: 13px; }
            
            .attestation { margin-top: 40px; border-top: 1px dashed #ccc; padding-top: 20px; font-style: italic; font-size: 13px; }
        </style>
    </head>
    <body>
        <div class="form-no">KP Form No. 16</div>
        <div class="header">
            <p>Republic of the Philippines</p>
            <p>Province of Misamis Oriental</p>
            <p>City of Cagayan de Oro</p>
            <p class="official">BARANGAY TABLON</p>
            <p>OFFICE OF THE LUPONG TAGAPAMAYAPA</p>
        </div>

        <div class="case-info">
            <div class="parties">
                <p><strong>${c.complainantName.toUpperCase()}</strong><br/><small>Complainant/s</small></p>
                <p style="margin: 10px 0;">--- versus ---</p>
                <p><strong>${c.respondentName.toUpperCase()}</strong><br/><small>Respondent/s</small></p>
            </div>
            <div class="meta">
                <p>CASE NO. <strong>${c.docketNo || 'N/A'}</strong></p>
                <p>FOR: <strong>${c.complaintType.toUpperCase()}</strong></p>
            </div>
        </div>

        <div class="title">
            <h1>AMICABLE SETTLEMENT</h1>
        </div>

        <div class="settlement-body">
            We, the complainant/s and respondent/s in the above-captioned case, do hereby agree to settle our dispute amicably as follows:
        </div>

        <div class="agreement-box">
            ${agreementDetails || '<i>No specific agreement details recorded yet. Please write the details of the settlement here.</i>'}
        </div>

        <div class="settlement-body">
            In witness whereof, we have hereunto set our hands this ____ day of ________, 202__ at Barangay Tablon, Cagayan de Oro City.
        </div>

        <div class="signatures-grid">
            <div class="sig-block">
                <div class="sig-line">Complainant/s Signature</div>
            </div>
            <div class="sig-block">
                <div class="sig-line">Respondent/s Signature</div>
            </div>
        </div>

        <div class="attestation">
            ATTESTATION: I hereby certify that the foregoing amicable settlement was entered into by the parties freely and voluntarily after I had explained to them the nature and consequence thereof.
        </div>

        <div class="signatures-grid" style="margin-top: 20px;">
             <div class="sig-block" style="grid-column: span 2; width: 300px; margin: 0 auto;">
                <div class="sig-line">PANGKAT CHAIRMAN / LUPON CHAIRMAN</div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const getKPForm20Template = (c: Case, reason?: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>KP Form 20 - Certificate to File Action - Barangay Tablon</title>
        <style>
            @page { size: portrait; margin: 1in; }
            body { font-family: 'Times New Roman', serif; line-height: 1.6; color: #000; padding: 0; }
            .header { text-align: center; margin-bottom: 20px; }
            .header p { margin: 2px 0; font-size: 14px; }
            .header .official { font-weight: bold; font-size: 18px; margin-top: 5px; }
            .form-no { position: absolute; top: 0; left: 0; font-weight: bold; font-size: 14px; }
            
            .title { text-align: center; margin: 30px 0; }
            .title h1 { font-size: 20px; text-decoration: underline; margin-bottom: 5px; }
            .title p { margin: 0; font-style: italic; }

            .case-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .parties { width: 45%; }
            .parties p { margin: 5px 0; }
            .meta { width: 45%; text-align: right; }

            .content { text-align: justify; text-indent: 50px; margin-bottom: 15px; }
            .reason-box { border: 1.5px solid #000; padding: 15px; margin: 20px 0; min-height: 80px; }
            
            .certification { margin: 30px 0; font-weight: bold; text-align: center; }
            
            .signatures { margin-top: 50px; display: flex; flex-direction: column; align-items: flex-end; }
            .sig-line { border-top: 1px solid #000; width: 250px; text-align: center; padding-top: 5px; margin-top: 40px; }
            
            .footer { margin-top: 40px; font-size: 12px; font-style: italic; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
    </head>
    <body>
        <div class="form-no">KP Form No. 20</div>
        <div class="header">
            <p>Republic of the Philippines</p>
            <p>Province of Misamis Oriental</p>
            <p>City of Cagayan de Oro</p>
            <p class="official">BARANGAY TABLON</p>
            <p>OFFICE OF THE LUPONG TAGAPAMAYAPA</p>
        </div>

        <div class="case-info">
            <div class="parties">
                <p><strong>${c.complainantName.toUpperCase()}</strong></p>
                <p style="font-size: 12px;">Complainant/s</p>
                <p>--- against ---</p>
                <p><strong>${c.respondentName.toUpperCase()}</strong></p>
                <p style="font-size: 12px;">Respondent/s</p>
            </div>
            <div class="meta">
                <p>BARANGAY CASE NO. <strong>${c.docketNo || 'N/A'}</strong></p>
                <p>FOR: <strong>${c.complaintType.toUpperCase()}</strong></p>
            </div>
        </div>

        <div class="title">
            <h1>CERTIFICATE TO FILE ACTION</h1>
            <p>(KATIBAYAN UPANG MAKADULOG SA HUKUMAN)</p>
        </div>

        <div class="content">
            This is to certify that no personal confrontation was had between the parties and that a certificate to file action is hereby issued because:
        </div>

        <div class="reason-box">
            <strong>REASON:</strong><br/>
            ${reason || 'The parties failed to reach an amicable settlement despite several mediation/conciliation attempts and sessions.'}
        </div>

        <div class="content">
            Therefore, the corresponding complaint of the dispute may now be filed with the proper court/government office.
        </div>

        <div class="signatures">
            <p>This ____ day of ________, 202___</p>
            <div class="sig-line">
                <strong>HON. LUPON CHAIRMAN</strong><br/>
                Punong Barangay / Lupon Chairman
            </div>
        </div>

        <div class="footer">
            "Authorized Official Document of Barangay Tablon Lupon Tagapamayapa"
        </div>
    </body>
    </html>
    `;
};

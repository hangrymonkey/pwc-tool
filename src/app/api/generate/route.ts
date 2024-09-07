import { NextRequest, NextResponse } from "next/server";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const document = body.get("pdf");

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not provided" },
      { status: 500 }
    );
  }

  try {
    const pdfLoader = new PDFLoader(document as Blob, {
      parsedItemSeparator: " ",
    });
    const docs = await pdfLoader.load();

    const selectedDocuments = docs.filter(
      (doc) => doc.pageContent !== undefined
    );
    const texts = selectedDocuments.map((doc) => doc.pageContent);

    const prompt = "I am a tax consultant and need a detailed tax analysis for my client,  Lenovo (Singapore) Pte. Ltd. I want to use the memo to identify new tax advisory opportunities (i.e. which area I can provide more detailed tax analysis services for further review). My client is in the e-commerce industry. The memo should include the following sections: 1. Background of Lenovo (Singapore) Pte. Ltd: Provide a summary of the company's business background and principal activities. List down the income types and description of services it provides. Company background reference website: N/A. 2.Summary of the Services Agreement and Contractual Relationship: If the provided documents or website refer to a services agreement, write a very detailed summary of key aspects of the services agreement. 3. Summary of income stream. If the provided documents include financial statements, balance sheets, profit loss, cashflow statement, and/or income statement. List down each type of revenue with values. 4. Potential Singapore Tax Review Opportunities: Based on the review of the financial information/services, please provide a detailed analysis of the Singapore tax implications for  Lenovo (Singapore) Pte. Ltd, covering the following areas. Each tax type, please provide an expanded analysis. It cannot be too wide/broad, must be very in-depth and detailed. a. Corporate Income Tax (CIT) -Provide a comprehensive and in-depth analysis of the Corporate Income Tax implications for the client - Include specific details on how their income is taxed, considering the classification of income streams (e.g., active vs. passive) and the applicability of any tax incentives or exemptions. - Discuss how the client’s operations in multiple jurisdictions might impact their CIT obligations. - Include any relevant considerations based on common practices in similar industries.- Pillar Two of the OECD’s Based Erosion and Profit Shifting (BEPS) implication. b. Withholding Tax - Discuss how double tax treaties might reduce or eliminate withholding tax, particularly for the client’s industry. - Analyse the withholding tax obligations for the client, focusing on payments made to non-resident entities. - Identify the types of payments that might be subject to withholding tax (e.g., royalties, interest, service fees). - Discuss the potential impact of double tax treaties on the client’s withholding tax obligations. c. Transfer Pricing - Offer an in-depth analysis of the transfer pricing regulations applicable to the client, particularly regarding transactions with related parties. - Explain how the client should document and justify intercompany charges to comply with arm's length principles. - Provide examples of typical transactions relevant to the client's business and how they should be priced. d. Permanent Establishment (PE). - Provide a detailed analysis of Permanent Establishment risks for the client, considering their global operations. - Discuss scenarios where the client might trigger PE in other countries and the tax consequences of such establishments. - Include general practices on managing PE risks, especially for businesses with significant cross-border activities. e. Stamp Duty: - Analyse scenarios where the client might be liable for stamp duty, such as on the transfer of shares, property, or financial instruments. - Discuss the implications of these transactions within the client’s business operations. - Provide examples of when stamp duty might apply and how the client can manage these obligations. f. Employment Taxes: - Provide a detailed explanation of the client’s employment tax obligations, focusing on payroll taxes, income tax withholding, and any equity compensation plans. - Discuss considerations for employees working across multiple jurisdictions and the potential tax obligations that arise. - Include any specific considerations based on the client’s business operations and workforce structure. g. Goods and Services Tax (GST) - Offer a thorough analysis of GST implications for the client, including how they should handle indirect taxes on their services or products. - Potential GST registration requirement if it is not registered for GST - Potential GST treatments that could be raised based on the review of the documents - Explain how cross-border transactions are treated under relevant GST rules. - Discuss common issues related to GST, such as place of supply rules and input tax credits. h. Other Potential Tax Implications: - Identify any additional tax risks or opportunities for the client that may arise from their business activities or financial arrangements. - Discuss general tax planning strategies that could benefit the client, considering their business model and operational footprint. - Highlight the area  Lenovo (Singapore) Pte. Ltd should focus more. Therefore, Draft the memo starting directly from the background section, without the standard memo header (To, From, Date, Subject). - The memo should use more formal/persuasive tone. The sentence should be more conciseness and clarity. Use British English. Reference website for the tax act: https://sso.agc.gov.sg/Act/ITA1947, https://sso.agc.gov.sg/Act/GSTA1993, https://sso.agc.gov.sg/SL/GSTA1993-RG1"
    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o",
    });

    const message = new HumanMessage({
      content: [
        {
          type: "text",
          text: prompt + "\n" + texts.join("\n"),
        },
      ],
    });

    const result = await model.invoke([message]);
    console.log(result);

    return NextResponse.json(
      { message: "created successfully" },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Cloud, File, Check, ChevronsUpDown } from "lucide-react";
import LoaderSpinner from "@/components/loaderspinner";
import UploadButton from "./UploadButton";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import OpenAIResponse from "@/components/OpenAIResponse";
import BubbleInput from "@/components/BubbleInput";

const industryTypes = [
  { label: "Financial Services", value: "fs" },
  { label: "Banking", value: "bkng" },
  { label: "Information and Communications Technology (ICT)", value: "ict" },
  { label: "Healthcare and Biomedical Sciences", value: "hbs" },
  { label: "Electronics", value: "el" },
  { label: "Aerospace and Aviation", value: "ana" },
  { label: "Logistics and Supply Chain Management", value: "lsc" },
  { label: "Maritime and Offshore Engineering", value: "moe" },
  { label: "Tourism and Hospitality", value: "tnh" },
  { label: "Real Estate and Urban Solutions", value: "reus" },
  { label: "Education and Training", value: "ent" },
  { label: "Energy and Chemicals", value: "enc" },
  { label: "Retail", value: "rtl" },
  { label: "E-commerce", value: "ecom" },
  { label: "Advanced Manufacturing", value: "am" },
  { label: "Media and Creative Industries", value: "mci" },
  { label: "Professional Services", value: "ps" },
] as const;

const formSchema = z.object({
  bizUnit: z.enum(["corporatetax", "gst", "tp"], {
    required_error: "You need to select a Business Unit.",
  }),
  industryType: z.string({
    required_error: "Please select an industry.",
  }),
  clientName: z.string(),

  // password: z.string().min(3),
  // passwordConfirm: z.string(),
  // accountType: z.enum(["personal", "company"]),
  // companyName: z.string().optional(),
});
// .refine(
//   (data) => {
//     return data.password === data.passwordConfirm;
//   },
//   {
//     message: "Passwords do not match",
//     path: ["passwordConfirm"],
//   }
// )
// .refine(
//   (data) => {
//     if (data.accountType === "company") {
//       return !!data.companyName;
//     }
//     return true;
//   },
//   {
//     message: "Company name is required",
//     path: ["companyName"],
//   }
// );

const UploadDoc = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      // password: "",
      // passwordConfirm: "",
      // companyName: "",
    },
  });

  const [document, setDocument] = useState<Blob | File | null | undefined>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");


  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    values: z.infer<typeof formSchema>
  ) => {
    e.preventDefault();
    console.log("onsubmit");
    if (!document) {
      setError("Please upload the document first");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();

    formData.append("pdf", document as Blob);
    formData.append("clientName", values.clientName);
    formData.append("bizUnit", values.bizUnit);
    formData.append("industryType", values.industryType); 

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      

      if (res.status === 200) {
        const result = await res.json(); 
        // TODO: this 
        console.log(result?.receivedData?.kwargs?.content);  
        setGeneratedContent(result?.receivedData?.kwargs?.content);
      }
    } catch (e) {
      console.log("error while generating", e);
    }

    setIsLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Hello");
    form.handleSubmit((values) => onSubmit(e, values))(); // Pass both event `e` and form `values`
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Prevent the form from submitting on Enter
    }
  };


  return (
    <div className="place-items-center">
      {/* <UploadButton /> */}
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="justify-center mt-2">
          <FormField
            control={form.control}
            name="bizUnit"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Which Business Unit (BU) are you in?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="corporatetax" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Corporate income tax (CIT)/ Corporate tax advisory (CTA)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="gst" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Goods and Services Tax (GST)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="tp" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Transfer Pricing (TP)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. XYZ Company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="industryType"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Which industry is your client in? </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? industryTypes.find(
                              (industryType) =>
                                industryType.value === field.value
                            )?.label
                          : "Select Industry"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search Industry..." />
                      <CommandList>
                        <CommandEmpty>Industry/ Sector is not listed. </CommandEmpty>
                        <CommandGroup>
                          {industryTypes.map((industryType) => (
                            <CommandItem
                              value={industryType.label}
                              key={industryType.value}
                              onSelect={() => {
                                form.setValue(
                                  "industryType",
                                  industryType.value
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  industryType.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {industryType.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border h-40 m-4 border-dashed border-gray-300 rounded-lg">
            <div className="flex items-center justify-center h-full w-full">
              <label
                htmlFor="document"
                className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <p>
                    <br />
                    <br />
                  </p>
                  <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                  <p className="mb-2 text-sm text-zinc-700">
                    <span className="font-semibold text-center">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>

                  {document && document?.name ? (
                    <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                      <div className="px-3 py-2 h-full grid place-items-center">
                        <File className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="px-3 py-2 h-full text-sm truncate">
                        {document.name}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <input
                  type="file"
                  id="document"
                  className="relative block w-full h-full z-50 opacity-0"
                  onChange={(e) => setDocument(e?.target?.files?.[0])}
                />
              </label>
            </div>
            {error ? <p className="red-text-100">{error}</p> : ""}
          </div>
          
          <div>
            <div className="text-left">Please include any reference website links </div>
            <BubbleInput />
          </div>

          <div>
            <div>Any specific content that you want the tool to make reference to?</div>
            <Input />
          </div>

          <div>
            <div>Which tax field you would to identify for more details?</div>
            <div></div>
            <Checkbox /> Corporate Income Tax
            <Checkbox /> GST  
            <Checkbox /> Withholding Tax
            <Checkbox /> Transfer Pricing
          </div>


          <p className="text-left">
            <Button size="lg" className="mt-2" type="submit">
              Generate Preview
            </Button>
            
            {isLoading? (<div>Loading... <LoaderSpinner /> </div>): ""}
            {!isLoading && generatedContent !== "" ? (<div><OpenAIResponse fullText={generatedContent} /></div>) : ""}
          </p>
        </form>
      </Form>
    </div>
  );
};

export default UploadDoc;

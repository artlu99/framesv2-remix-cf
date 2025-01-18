import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

interface DevDemosProps {
  myVar: string;
  fid: number;
  count: number;
}

export const DevDemos = (props: DevDemosProps) => {
  const { myVar, fid, count } = props;

  return (
    <>
      <hr />
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Dev demos</AccordionTrigger>
          <AccordionContent>
            <article className="prose my-4 dark:text-gray-300">
              <ul>
                <li>myVar: {myVar}</li>
                <li>fid: {fid}</li>
                <li>count: {count}</li>
              </ul>
              <p>
                <a href="/nerds" className="no-underline">
                  More ...
                </a>
              </p>
            </article>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

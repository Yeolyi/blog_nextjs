import "highlight.js/styles/github-dark.css";
import { Metadata } from "next";
import getSrcPath from "@/app/lib/getSrcPath";
import iteratePath from "@/app/lib/iteratePath";
import CustomMDXRemote from "./CustomMDXRemote";
import getFilledMD from "@/app/lib/getFilledMD";
import TOC from "@/app/docs/[[...path]]/TOC";
import { MarkGithubIcon } from "@primer/octicons-react";

interface PostProps {
  params: {
    path?: string[];
  };
}

export const generateMetadata = async ({
  params,
}: PostProps): Promise<Metadata> => {
  const { data } = await getFilledMD({
    type: "SEGMENTS",
    segments: params.path,
  });

  return {
    title: data.title,
    description: data.description,
  };
};

export default async function PostPage({ params }: PostProps) {
  const { data, content, toc } = await getFilledMD({
    type: "SEGMENTS",
    segments: params.path,
  });

  return (
    <>
      <div className="flex flex-col">
        <h1>{data?.title}</h1>
        {data.description && (
          <span className="mb-[16px]">{data.description}</span>
        )}
        {toc.h2.length && <TOC toc={toc} />}
        <a className="self-end" href={getGithubLink(params.path)}>
          <MarkGithubIcon size={24} />
        </a>
        <hr className="mt-[16px] mb-[32px]" />
      </div>
      <CustomMDXRemote segments={params.path ?? []} source={content} />
    </>
  );
}

export const generateStaticParams = async () => {
  const params: { path: string[] }[] = [];
  const srcPath = getSrcPath();
  const skipFolder = (path: string) =>
    path === "node_modules" || path.startsWith(".");
  const f = (filePath: string, segments: string[]) => {
    if (filePath.endsWith("/index.md")) {
      params.push({ path: segments });
    }
  };
  await iteratePath(srcPath, [], f, skipFolder);

  return params;
};

const getGithubLink = (path: string[] | undefined) => {
  if (path === undefined || path.length === 0) {
    return `https://github.com/Yeolyi/blog_src/blob/main/index.md`;
  }
  return `https://github.com/Yeolyi/blog_src/blob/main/${path.join(
    "/"
  )}/index.md`;
};

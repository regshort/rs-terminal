const TwitterHead = ({ description, ogUrl, ogImage, ogTitle }: any) => {
  return (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={process.env.NEXT_PUBLIC_TWITTER} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content={process.env.NEXT_PUBLIC_TWITTER} />
      <meta property="og:url" content={ogUrl} />
      <meta name="twitter:image" content={ogImage} />
    </>
  )
}

export default TwitterHead

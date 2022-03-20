import React from 'react';
import { Helmet } from "react-helmet";

const Meta = ({title, description, keywords}) => {
  return (
    <>
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
    </Helmet>
    </>
  )
}

Meta.defaultProps = {
    title: 'Welcome to CromoShop',
    description: "The best e-commerce site",
    keywords: "electronics"
}

export default Meta
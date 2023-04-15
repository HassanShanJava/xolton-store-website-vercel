import React from "react";
import CraftJsComponent from "../craftComponent/CraftJsComponent";

const AboutUs = () => {
  const storeBlogsData: any = {
    data: "eyJST09UIjp7InR5cGUiOiJkaXYiLCJpc0NhbnZhcyI6ZmFsc2UsInByb3BzxCdjbGFzc05hbcQsdy1mdWxsIGJvcmRlci1kYXNoZWTIDjLICWFjLTIgaC1bMTAwdmhdIG1iLTIgIG92ZXJmbG93LXktc2Nyb2xsIn0sImRpc3BsYXnHXeYAiWN1c3RvbSI6e30sImhpZGRlbukAk25vZGVzIjpbInp5Z0xOcXh1SDAiXSwibGlua2VkTsYde319LMwg6QDoeyJyZXNvbHZlZMdvQ29udGFpbmVy5ACK6gD/dHJ17AD+YmFja2dyb3VuZCI6IiNmZmZmIiwicGFkZGluZyI6MjAsImRhdGEtY3kiOiJyb290LWPMV+4A4cpy7gDncGFyZW50IjrmAZr6APdJUGRhQm5iOHhV9gD3yyD/APf/APf0APfwAPn/AN7zAN7rAZb6AORpYmlCcTZKa1VVIiwiQXdLVm1jemczSiIsIlk2SjlUNnpGeUQiLCJhSEhhdU8zZURGIiwiYnp4X3o3ZXFWTyIsIldWQktZR0NIRzYiLCJyYWdnekdNOEk09gEyy276ATJUZXh07gEt8AMjdMQiOiJGQVFzIiwiZm9udFNpemUiOjMxxg5BbGlnbiI6ImNlbnTlASDFI3R5bMRfaXRhbGlj8gIuxXf3AUvrAer5AUv1APHrAVL/APH/APHlAPF4b2x0b24gbWFya2V0IHBsYWNlIGlzIG9uZSBvZiBraW5kIHdoZXJlIHlvdSBjYW4gc2VsbMQNciBvd24gTkZUU+0BMDE29QEw/wEb/wEb/wEb6QEb6wJT+gEbRHJvcERvd25JdGVt/wEj5gEjV+UBAOQA/OQBBOYBI05m5AC+xCEyIjoiSGkgd29ybGTtAQoyMsoOMSI6MTXuAjRub3JtYfMFQ+0An/8BIf8BIfIBIesDgf8EX/8EX/8EX/8EX/8A2P8A2PMA2OsEP/8B+f8B+e8B+WF05AMNQ3J5cHRvTeUDI/8B9vQA9/8B0v8A+v8A+usFLP8A+v8A+vIA+nRoaXMgc3RvcmUgYWJvdf8A+/8A+/8A+/8A+/UA++sGGv8A+/8A++0A+2hvd+UD7GnmBOr/A+n/APj/APj/APj1APh9",
  };
  return (
    <>
      <div className="max-h-full min-h-screen w-full  bg-bg-1 px-8 py-4">
        <CraftJsComponent storeBlogsData={storeBlogsData} />
      </div>
    </>
  );
};

export default AboutUs;

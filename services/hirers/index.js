const express = require("express");
const q2m = require("query-to-mongo");
const { authenticate, refreshToken } = require("../authTools/authTools");
const { authorize, recruiterOnly } = require("../middlewares/authorize");
const { verifyJWT } = require("../authTools/authTools");
const UsersModel = require("../schema/schema");
const hirersRouter = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const fs = require("fs-extra");
const path = require("path");
const upload = multer({});
const sgMail = require("@sendgrid/mail");
const { findById } = require("../schema/schema");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "some-folder-name",
    format: async (req, file) => "png", // supports promises as well
    public_id: (req, file) => "computed-filename-using-request",
  },
});

const cloudinaryUpload = multer({ storage: storage });

hirersRouter.post(
  "/images/:id",
  cloudinaryUpload.single("image"),
  authorize,

  async (req, res, next) => {
    console.log(req.file);
    const user = await UsersModel.findByIdAndUpdate(req.params.id, {
      image: req.file.path,
    });

    res.send(await index.saveObject({ ...user._doc, objectID: req.params.id }));
  }
);

hirersRouter.post(
  "/sendEmail",
  authorize,
  recruiterOnly,
  async (req, res, next) => {
    //console.log("ENV ", process.env.SENDGRID_API_KEY);
    console.log(req.body._id);
    let recruiter = await UsersModel.findById(req.user._id);
    let user = await UsersModel.findById(req.body._id);
    console.log("this is the user:" + JSON.stringify(user));
    const msg = {
      to: user.email,
      from: "hire.me.rec@gmail.com",
      subject: `${recruiter.name} ${recruiter.surname} wants to talk with you`,
      text: `Hello dear ${user.name}`,
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
            <!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=Edge">
            <!--<![endif]-->
            <!--[if (gte mso 9)|(IE)]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <!--[if (gte mso 9)|(IE)]>
        <style type="text/css">
          body {width: 600px;margin: 0 auto;}
          table {border-collapse: collapse;}
          table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
          img {-ms-interpolation-mode: bicubic;}
        </style>
      <![endif]-->
            <style type="text/css">
          body, p, div {
            font-family: arial,helvetica,sans-serif;
            font-size: 14px;
          }
          body {
            color: #000000;
          }
          body a {
            color: #aab1b6;
            text-decoration: none;
          }
          p { margin: 0; padding: 0; }
          table.wrapper {
            width:100% !important;
            table-layout: fixed;
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          img.max-width {
            max-width: 100% !important;
          }
          .column.of-2 {
            width: 50%;
          }
          .column.of-3 {
            width: 33.333%;
          }
          .column.of-4 {
            width: 25%;
          }
          @media screen and (max-width:480px) {
            .preheader .rightColumnContent,
            .footer .rightColumnContent {
              text-align: left !important;
            }
            .preheader .rightColumnContent div,
            .preheader .rightColumnContent span,
            .footer .rightColumnContent div,
            .footer .rightColumnContent span {
              text-align: left !important;
            }
            .preheader .rightColumnContent,
            .preheader .leftColumnContent {
              font-size: 80% !important;
              padding: 5px 0;
            }
            table.wrapper-mobile {
              width: 100% !important;
              table-layout: fixed;
            }
            img.max-width {
              height: auto !important;
              max-width: 100% !important;
            }
            a.bulletproof-button {
              display: block !important;
              width: auto !important;
              font-size: 80%;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .columns {
              width: 100% !important;
            }
            .column {
              display: block !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            .social-icon-column {
              display: inline-block !important;
            }
          }
        </style>
            <!--user entered Head Start--><!--End Head user entered-->
          </head>
          <body>
            <center class="wrapper" data-link-color="#aab1b6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#FFFFFF;">
              <div class="webkit">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
                  <tr>
                    <td valign="top" bgcolor="#FFFFFF" width="100%">
                      <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td>
                                  <!--[if mso]>
          <center>
          <table><tr><td width="600">
        <![endif]-->
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                            <tr>
                                              <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
          <tr>
            <td role="module-content">
              <p></p>
            </td>
          </tr>
        </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="e1db18f8-1d23-49b5-a50c-546765a9f3bd">
          <tbody>
            <tr>
              <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
                <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:30% !important; width:30%; height:auto !important;" width="180" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/27bf0c92c93cb775/980af9c2-fbc2-4889-979a-1f21ea693def/1200x1200.png">
              </td>
            </tr>
          </tbody>
        </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:10px 10px 10px 10px;" bgcolor="#FFC359">
          <tbody>
            <tr role="module-content">
              <td height="100%" valign="top"><table width="280" style="width:280px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
            <tbody>
              <tr>
                <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="7064526d-45d3-48f8-b943-1bdabbe81a48">
          <tbody>
            <tr>
              <td style="font-size:6px; line-height:10px; padding:50px 0px 50px 0px;" valign="top" align="center">
                <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:60% !important; width:60%; height:auto !important;" width="168" alt="" data-proportionally-constrained="true" data-responsive="true" src=${recruiter.image}>
              </td>
            </tr>
          </tbody>
        </table></td>
              </tr>
            </tbody>
          </table>
          <table width="280" style="width:280px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-1">
            <tbody>
              <tr>
                <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="294694cf-8318-4914-b7af-9145729cf828">
          <tbody>
            <tr>
              <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="">
                <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="1px" style="line-height:1px; font-size:1px;">
                  <tbody>
                    <tr>
                      <td style="padding:0px 0px 1px 0px;" bgcolor="#000000"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="ff21b5ab-aef3-439d-9399-a868758cec52" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:18px 0px 18px 0px; line-height:18px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 12px">Hey &nbsp;${user.name}, we have some great news for you!</span></div>
      <div style="font-family: inherit; text-align: inherit"><span style="font-size: 12px">${recruiter.name} ${recruiter.surname} wants to talk with you about a job offer!&nbsp;</span></div>
      <div style="font-family: inherit; text-align: inherit"><span style="font-size: 12px">This is his mail ${recruiter.email}.&nbsp;</span></div>
      <div style="font-family: inherit; text-align: inherit"><span style="font-size: 12px">Good luck from the staff of Hire.ME!&nbsp;</span></div><div></div></div></td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="108952ea-4dae-4741-aa24-dcff717e8259">
          <tbody>
            <tr>
              <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="">
                <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="1px" style="line-height:1px; font-size:1px;">
                  <tbody>
                    <tr>
                      <td style="padding:0px 0px 1px 0px;" bgcolor="#000000"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="7aaa750e-c69e-4d1c-9803-202f3d84b227" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:18px 0px 18px 0px; line-height:0px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit">Personal linkedin of ${recruiter.name}:</div><div></div></div></td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="social" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="9c7d33fc-9d96-4999-b47e-d4da15b52cd1">
          <tbody>
            <tr>
              <td valign="top" style="padding:0px 0px 10px 0px; font-size:6px; line-height:10px;" align="left">
                <table align="left" style="-webkit-margin-start:auto;-webkit-margin-end:auto;">
                  <tbody><tr align="left"><td style="padding: 0px 5px;" class="social-icon-column">
            <a role="social-icon-link" href="https://www.linkedin.com/in/diegobanovaz/" target="_blank" alt="LinkedIn" title="LinkedIn" style="display:inline-block; background-color:#FFC359; height:30px; width:30px; border-radius:50px; -webkit-border-radius:50px; -moz-border-radius:50px;">
              <img role="social-icon" alt="LinkedIn" title="LinkedIn" src="https://marketing-image-production.s3.amazonaws.com/social/white/linkedin.png" style="height:30px; width:30px;" height="30" width="30">
            </a>
          </td></tr></tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b62ce16a-199f-4916-89b6-aea22f3d35b6">
          <tbody>
            <tr>
              <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="">
                <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="1px" style="line-height:1px; font-size:1px;">
                  <tbody>
                    <tr>
                      <td style="padding:0px 0px 1px 0px;" bgcolor="#000000"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a075fc7a-af52-4df0-8640-948397053ebf" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:18px 0px 18px 0px; line-height:0px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit">Recruiter's agency:</div><div></div></div></td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="social" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="9c7d33fc-9d96-4999-b47e-d4da15b52cd1.1">
          <tbody>
            <tr>
              <td valign="top" style="padding:0px 0px 10px 0px; font-size:6px; line-height:10px;" align="left">
                <table align="left" style="-webkit-margin-start:auto;-webkit-margin-end:auto;">
                  <tbody><tr align="left"><td style="padding: 0px 5px;" class="social-icon-column">
            <a role="social-icon-link" href=" https://www.linkedin.com/school/strive-school/" target="_blank" alt="LinkedIn" title="LinkedIn" style="display:inline-block; background-color:#FFC359; height:30px; width:30px; border-radius:50px; -webkit-border-radius:50px; -moz-border-radius:50px;">
              <img role="social-icon" alt="LinkedIn" title="LinkedIn" src="https://marketing-image-production.s3.amazonaws.com/social/white/linkedin.png" style="height:30px; width:30px;" height="30" width="30">
            </a>
          </td></tr></tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="c9ac6d75-1c34-4689-a7e0-74d14b7148e8">
          <tbody>
            <tr>
              <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="">
                <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="1px" style="line-height:1px; font-size:1px;">
                  <tbody>
                    <tr>
                      <td style="padding:0px 0px 1px 0px;" bgcolor="#000000"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table></td>
              </tr>
            </tbody>
          </table></td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="890c5a85-ba59-4425-a08f-c4fb798e831e">
          <tbody>
            <tr>
              <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
              </td>
            </tr>
          </tbody>
        </table></td>
                                            </tr>
                                          </table>
                                          <!--[if mso]>
                                        </td>
                                      </tr>
                                    </table>
                                  </center>
                                  <![endif]-->
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </center>
          </body>
        </html> `,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
        res.send("Email sent");
      })
      .catch((error) => {
        console.error(error);
        next(error);
      });
  }
);

hirersRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const hirers = await UsersModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);

    res.send(hirers);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

hirersRouter.get("/ByToken/:token", async (req, res, next) => {
  try {
    const token = req.params.token;
    const { _id } = await verifyJWT(token);
    const hirer = await UsersModel.findById(_id);
    res.send(hirer);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

hirersRouter.get("/:_id", async (req, res, next) => {
  try {
    const hirer = await UsersModel.findById(req.params._id);
    console.log(hirer);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

hirersRouter.post("/signup", async (req, res, next) => {
  try {
    console.log(req.body);
    const newHirer = new UsersModel({ ...req.body, role: "recruiter" });
    const newUser = await newHirer.save();
    delete req.body.password;
    delete req.body.email;

    // await index.saveObject({ ...req.body, objectID: newUser._id });
    res.status(201).send({ _id: newUser._id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

hirersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hirer = await UsersModel.findByCredentials(email, password);
    const tokens = await authenticate(hirer);
    res.send(tokens);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

hirersRouter.post("/refreshtoken", async (req, res, nest) => {
  const oldRefreshToken = req.body.refreshToken;
  if (!oldRefreshToken) {
    const err = new Error("Forbidden");
    err.httpStatusCode = 403;
    next(err);
  } else {
    try {
      const newTokens = await refreshToken(oldRefreshToken);
      res.send(newTokens);
    } catch (error) {
      console.log(error);
      const err = new Error(error);
      err.httpStatusCode = 403;
      next(err);
    }
  }
});

hirersRouter.post("/logout", authorize, async (req, res, next) => {
  try {
    req.user.refreshTokens = req.user.refreshTokens.filter(
      (t) => t.token !== req.body.refreshToken
    );
    await req.user.save();
    res.send();
  } catch (err) {
    next(err);
  }
});

hirersRouter.delete("/:_id", authorize, async (req, res, next) => {
  try {
    await req.user.remove();
    res.send("Deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = hirersRouter;

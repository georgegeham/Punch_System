<!DOCTYPE html>
<html >
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Smart Punching System</title>
  </head>
  <div
    style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;"
  >
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
    >
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="600"
            style="background-color: #ffffff; border-radius: 8px; overflow: hidden;"
          >
            <!-- Header -->
            <tr>
              <td
                align="center"
                style="background-color: #2563eb; padding: 20px 0;"
              >
                <h1
                  style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;"
                >
                  Welcome to {{ config('app.name') }}!
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px 40px; color: #333333;">
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Hi {{ $user->name }},
                </p>

                <p style="font-size: 16px; margin-bottom: 20px;">
                  We're excited to have you join our Smart Punching System. You can now explore all the features and get started.
                </p>

                <!-- Button -->
                <table  cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" bgcolor="#2563eb" style="border-radius: 6px;">
                      <a
                        href="http://localhost:3000"
                        style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold;"
                        >Go to Dashboard</a
                      >
                    </td>
                  </tr>
                </table>

                <p style="font-size: 14px; margin-top: 30px; color: #777777;">
                  If you didn’t register for this account, please ignore this message.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                align="center"
                style="background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #999999;"
              >
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</html>

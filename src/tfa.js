exports.html = (id, tokenid) => `
<html>
    <body>
    <center>
        <h2>Verify your identity with the code in your ACME app:</h2>
        <form method="post" action="/2fa">
            <input type="hidden" name="id" value="${id}">
            <input type="hidden" name="tokenid" value="${tokenid}">
            <input name="totp" type="text">
            <input type="submit" value="Submit">
        </form>
    </center>
    </body>
</html>
`;

import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@netlify/remix-runtime";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";

export const loader = async ({params}: LoaderFunctionArgs) => {
    const id = params.id;
    return json(`id: ${id}`);
}

export const action = async ({
    params,
    request,
}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const id = params.id;
    console.log(id);
    console.log(formData.get('name'));
    return redirect('/');
}

export default function ParameterTest() {
    const id = useLoaderData<typeof loader>();

    const [count, setCount] = useState(0);
    const incrementCount = () => {
        setCount(count + 1);
    }

    return (
        <div>
            <p>{id}</p>
            <p>Count: {count}</p>
            <button onClick={incrementCount}>Increment count</button>
            <Form method="post">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" />
                <button type="submit">Submit</button>
            </Form>
        </div>
    );
}